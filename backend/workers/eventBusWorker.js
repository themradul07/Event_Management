const Outbox = require('../models/Outbox');
const PaymentEvent = require('../models/PaymentEvent');
const logger = require('../utils/logger');

const pollOutbox = async () => {
    try {
        const pendingItems = await Outbox.find({ status: 'pending' }).limit(50);
        if (pendingItems.length === 0) return;

        logger.debug(`Outbox worker: processing ${pendingItems.length} pending events.`);

        for (const item of pendingItems) {
            try {
                // Run root-cause diagnosis agent
                const { diagnoseEvent } = require('../services/diagnosisService');
                const diagnosis = await diagnoseEvent(item.payload);
                
                // Enforce confidence gate (< 0.7 routes to needs_review)
                const targetStatus = diagnosis.confidence < 0.7 ? 'needs_review' : 'processed';

                // Deduplicated insert into PaymentEvent
                const createdEvent = await PaymentEvent.create({
                    event_id: item.event_id,
                    member_id: item.payload.member_id,
                    subscription_id: item.payload.subscription_id || 'none',
                    amount: item.payload.amount,
                    failure_code: item.payload.failure_code,
                    error_description: item.payload.error_description || '',
                    timestamp: item.payload.timestamp || new Date(),
                    retry_count: item.payload.retry_count || 0,
                    source: item.payload.source,
                    status: targetStatus,
                    diagnosis_cause: diagnosis.cause,
                    diagnosis_confidence: diagnosis.confidence,
                    diagnosis_reasoning: diagnosis.reasoning
                });

                item.status = 'published';
                await item.save();
                logger.info(`Successfully published event: ${item.event_id} (${item.payload.failure_code})`);

                // If event bypasses confidence gate, execute automated recovery playbook
                if (targetStatus === 'processed') {
                    const { processIntervention } = require('../services/interventionEngine');
                    await processIntervention(createdEvent);
                }
            } catch (error) {
                if (error.code === 11000) {
                    // Duplicate key error - deduplicate by marking published
                    logger.warn(`Duplicate event detected and discarded: ${item.event_id}`);
                    item.status = 'published';
                    await item.save();
                } else {
                    logger.error(`Error processing outbox item ${item.event_id}: ${error.message}`);
                    item.status = 'failed';
                    await item.save();
                }
            }
        }
    } catch (err) {
        logger.error(`Error running outbox poll worker: ${err.message}`);
    }
};

const pollPlaybookScheduler = async () => {
    try {
        const AuditLog = require('../models/AuditLog');
        const RecoveryPlaybook = require('../models/RecoveryPlaybook');
        const UserModel = require('../models/User');
        const { processIntervention } = require('../services/interventionEngine');

        // Find all active recovery events (status: processed)
        const activeEvents = await PaymentEvent.find({ status: 'processed' });
        if (activeEvents.length === 0) return;

        const parseDelayToMs = (delayStr) => {
            if (!delayStr) return 0;
            const val = parseFloat(delayStr);
            if (isNaN(val)) return 0;
            if (delayStr.endsWith('m')) return val * 60 * 1000;
            if (delayStr.endsWith('h')) return val * 60 * 60 * 1000;
            if (delayStr.endsWith('d')) return val * 24 * 60 * 60 * 1000;
            return val * 60 * 60 * 1000; // default to hours
        };

        for (const event of activeEvents) {
            try {
                // Fetch User details
                const user = await UserModel.findById(event.member_id);
                if (user && user.isMember && event.diagnosis_cause !== 'checkout_abandoned') {
                    // User already active. Skip further recovery steps
                    continue;
                }

                // Load playbook for cause
                const playbook = await RecoveryPlaybook.findOne({ cause: event.diagnosis_cause });
                if (!playbook || !playbook.actions || playbook.actions.length === 0) {
                    continue;
                }

                // Count past interventions for this event
                const pastAudits = await AuditLog.find({
                    event_id: event._id,
                    cause: event.diagnosis_cause,
                    action: { $ne: 'suppress_recovery' }
                }).sort({ createdAt: 1 });

                const totalRetries = pastAudits.filter(a => a.action.startsWith('retry')).length;
                const totalNudges = pastAudits.filter(a => a.action.startsWith('nudge')).length;
                const currentStepIndex = totalRetries + totalNudges;

                // Check if limits exceeded
                if (totalRetries >= playbook.max_retries && totalNudges >= playbook.max_nudges) {
                    // Let processIntervention escalate it to needs_review
                    await processIntervention(event);
                    continue;
                }

                if (currentStepIndex < playbook.actions.length) {
                    const nextAction = playbook.actions[currentStepIndex];
                    
                    // Baseline is the last action's execution time, or the event creation time if first step
                    const lastActionTime = pastAudits.length > 0 
                        ? pastAudits[pastAudits.length - 1].createdAt 
                        : event.timestamp || event.createdAt;

                    const delayMs = parseDelayToMs(nextAction.delay);
                    const dueTime = new Date(new Date(lastActionTime).getTime() + delayMs);

                    if (new Date() >= dueTime) {
                        logger.info(`Scheduler: Playbook step ${currentStepIndex + 1} (${nextAction.type} via ${nextAction.channel}) is due for event ${event.event_id}. Executing...`);
                        await processIntervention(event);
                    }
                }
            } catch (err) {
                logger.error(`Error in playbook scheduler for event ${event.event_id}: ${err.message}`);
            }
        }
    } catch (error) {
        logger.error(`Error running playbook scheduler poll: ${error.message}`);
    }
};

const startPolling = () => {
    logger.info("Outbox transactional event bus polling worker started (running every 2 seconds).");
    setInterval(pollOutbox, 2000);

    logger.info("Playbook scheduler polling worker started (running every 5 seconds).");
    setInterval(pollPlaybookScheduler, 5000);
};

module.exports = {
    startPolling,
    pollOutbox,
    pollPlaybookScheduler
};
