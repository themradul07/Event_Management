const AuditLog = require('../models/AuditLog');
const PromiseToPay = require('../models/PromiseToPay');
const PaymentEvent = require('../models/PaymentEvent');
const UserModel = require('../models/User');
const logger = require('../utils/logger');
const path = require('path');
const fs = require('fs');

// Load Playbook rules from JSON configuration file
const loadPlaybook = () => {
    try {
        const filePath = path.join(__dirname, '../config/recoveryPlaybook.json');
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContent);
    } catch (error) {
        logger.error(`Error loading recovery playbook config: ${error.message}`);
        return {};
    }
};

// Generates English message nudges
const generateEnglishNudge = (name, amount, cause, details) => {
    const link = "http://localhost:5173/membership";
    switch (cause) {
        case 'insufficient_funds':
            return `Dear ${name}, your BietHub membership billing of ₹${amount} failed due to insufficient account balance. Please top up your account or pay here: ${link}`;
        case 'card_expired':
            return `Dear ${name}, your registered debit/credit card has expired. To maintain uninterrupted access to premium events, please update your billing details here: ${link}`;
        case 'bank_timeout':
            return `Dear ${name}, we encountered a temporary bank network connection timeout processing your subscription. We will silently retry this action shortly.`;
        case 'mandate_revoked':
            return `Dear ${name}, your recurring billing authorization mandate has been suspended. Please re-authorize mandate details to avoid subscription cancellation: ${link}`;
        case 'checkout_abandoned':
            return `Hi ${name}, you recently left our checkout page. Don't miss out on premium activity access! Complete your subscription here: ${link}`;
        case 'invoice_overdue':
            return `Hello, your corporate B2B wellness package invoice of ₹${amount} is overdue. Please coordinate with your corporate HR department to settle this outstanding payment.`;
        default:
            return `Hi ${name}, your BietHub subscription payment of ₹${amount} has failed. Please check your payment methods or contact support.`;
    }
};

// Generates Hinglish message nudges (Track 3 differentiator)
const generateHinglishNudge = (name, amount, cause, details) => {
    const link = "http://localhost:5173/membership";
    switch (cause) {
        case 'insufficient_funds':
            return `Hey ${name}, aapka ₹${amount} ka membership payment account balance low hone ki wajah se fail ho gaya hai. Please bank balance check karein ya is link se retry karein: ${link}`;
        case 'card_expired':
            return `Hi ${name}, aapka registered card expire ho chuka hai. Activity pass features maintain rakhne ke liye naya card update karein: ${link}`;
        case 'bank_timeout':
            return `Hey ${name}, bank side gateway timeout ki wajah se processing block ho gayi thi. Safe side rehne ke liye double charge avoid karte hue hum automatically retry kar rahe hain.`;
        case 'mandate_revoked':
            return `Hi ${name}, aapka auto-debit billing mandate cancel ho gaya hai. Premium benefits continue rakhne ke liye dobara mandate check karein: ${link}`;
        case 'checkout_abandoned':
            return `Hey ${name}, aapne checkout page incomplete chhod diya tha. Premium workshops aur events access unlock karne ke liye payment complete karein: ${link}`;
        case 'invoice_overdue':
            return `Hello, aapke group package ka corporate B2B wellness invoice overdue hai. Settle down karne ke liye kindly company finance/HR team se baat karein.`;
        default:
            return `Hey ${name}, aapka ₹${amount} ka platform fee payment fail ho gaya hai. Check card settings ya retry karein: ${link}`;
    }
};

/**
 * Evaluates event diagnosis and schedules recovery action sequence
 */
const processIntervention = async (event) => {
    try {
        const cause = event.diagnosis_cause;
        const memberId = event.member_id;

        // Skip processing if success or not diagnosed
        if (cause === 'success' || !cause || cause === 'unknown') {
            event.status = 'processed';
            await event.save();
            return;
        }

        // Fetch User details
        const user = await UserModel.findById(memberId);
        const name = user ? user.name : 'Valued Member';

        // 1. Check for Active Promise-to-Pay (PTP) Suppressor
        const activePTP = await PromiseToPay.findOne({
            member_id: memberId,
            status: 'active',
            promised_date: { $gte: new Date() }
        });

        if (activePTP) {
            logger.info(`Recovery intervention suppressed for user ${memberId} due to active Promise-to-Pay`);
            
            // Record suppression audit log
            await AuditLog.create({
                member_id: memberId,
                event_id: event._id,
                cause: cause,
                action: 'suppress_recovery',
                bound_applied: `PTP active until ${activePTP.promised_date.toLocaleDateString()}`,
                reasoning_summary: `Suppressed recovery nudge because user committed to pay ₹${activePTP.promised_amount} on ${activePTP.promised_date.toLocaleDateString()}`,
                channel: 'system',
                message_sent: ''
            });

            event.status = 'processed';
            await event.save();
            return;
        }

        // 2. Load recovery playbook rules from DB
        const RecoveryPlaybook = require('../models/RecoveryPlaybook');
        const playbookEntry = await RecoveryPlaybook.findOne({ cause: cause });
        if (!playbookEntry) {
            logger.warn(`No recovery playbook settings found in DB for cause: ${cause}`);
            event.status = 'processed';
            await event.save();
            return;
        }

        // 3. Count past interventions for this member and cause in AuditLog
        const pastAudits = await AuditLog.find({
            member_id: memberId,
            cause: cause,
            action: { $ne: 'suppress_recovery' }
        });

        const totalRetries = pastAudits.filter(a => a.action.startsWith('retry')).length;
        const totalNudges = pastAudits.filter(a => a.action.startsWith('nudge')).length;

        // 4. Validate Bounds
        if (totalRetries >= playbookEntry.max_retries && totalNudges >= playbookEntry.max_nudges) {
            logger.info(`Max recovery limits reached for member ${memberId} on cause ${cause}. Escalating to support.`);

            await AuditLog.create({
                member_id: memberId,
                event_id: event._id,
                cause: cause,
                action: 'escalate_to_human',
                bound_applied: `Max attempts exceeded (Retries: ${playbookEntry.max_retries}, Nudges: ${playbookEntry.max_nudges})`,
                reasoning_summary: 'All automated playbook steps exhausted. Exceeded rate-limiting limits. Escalated to manual human support queue.',
                channel: 'system',
                message_sent: ''
            });

            // Route event to Needs Review status for support agent attention
            event.status = 'needs_review';
            await event.save();
            return;
        }

        // 5. Select next action from playbook sequence
        const currentStepIndex = totalRetries + totalNudges;
        const nextAction = playbookEntry.actions[currentStepIndex] || playbookEntry.actions[playbookEntry.actions.length - 1];

        if (!nextAction) {
            logger.warn(`No recovery action step mapped at index ${currentStepIndex} for cause ${cause}`);
            event.status = 'processed';
            await event.save();
            return;
        }

        // 6. Generate action details and text
        let messageText = '';
        let actionKey = '';
        let channelName = 'system';

        if (nextAction.type === 'nudge') {
            channelName = nextAction.channel;
            actionKey = `nudge_${nextAction.channel}`;
            if (nextAction.message_type === 'hinglish') {
                messageText = generateHinglishNudge(name, event.amount, cause, event.error_description);
            } else {
                messageText = generateEnglishNudge(name, event.amount, cause, event.error_description);
            }
        } else if (nextAction.type === 'retry') {
            actionKey = nextAction.silent ? 'retry_silent' : 'retry_standard';
            messageText = `Attempting automated background transaction charge retry of ₹${event.amount}.`;
        } else if (nextAction.type === 'cancel') {
            actionKey = 'subscription_cancel';
            messageText = `Playbook limit reached. Automatically cancelling user subscription.`;
        }

        // 7. Write to AuditLog prior to executing action
        await AuditLog.create({
            member_id: memberId,
            event_id: event._id,
            cause: cause,
            action: actionKey,
            bound_applied: `Step ${currentStepIndex + 1} of recovery playbook`,
            reasoning_summary: `Executing playbook automated step: ${nextAction.type.toUpperCase()} via ${channelName.toUpperCase()}`,
            channel: channelName,
            message_sent: messageText
        });

        // 8. Execute the intervention (e.g. log output or send Nodemailer if email)
        if (nextAction.type === 'nudge' && nextAction.channel === 'email' && user?.email) {
            try {
                const { SendGeneralEmail } = require('../utils/email'); // Nodemailer utility
                await SendGeneralEmail(user.email, `Billing Alert: Subscription Issues`, `Dear ${name},\n\n${messageText}\n\nBest Regards,\nBietHub Platform`);
                logger.info(`Real email billing nudge sent to ${user.email}`);
            } catch (err) {
                logger.error(`Failed to send real email nudge: ${err.message}`);
            }
        } else if (nextAction.type === 'nudge' && nextAction.channel === 'whatsapp' && user?.email) {
            try {
                const { SendGeneralEmail } = require('../utils/email'); // Nodemailer utility
                await SendGeneralEmail(user.email, `Billing Alert: [WhatsApp Nudge Trial]`, `Dear ${name},\n\n[WhatsApp Trial Message]:\n${messageText}\n\nBest Regards,\nBietHub Platform`);
                logger.info(`WhatsApp trial email nudge sent to ${user.email}`);
            } catch (err) {
                logger.error(`Failed to send WhatsApp trial email nudge: ${err.message}`);
            }
        } else if (nextAction.type === 'nudge' && nextAction.channel === 'sms' && user?.email) {
            try {
                const { SendGeneralEmail } = require('../utils/email'); // Nodemailer utility
                await SendGeneralEmail(user.email, `Billing Alert: [SMS Nudge Trial]`, `Dear ${name},\n\n[SMS Trial Message]:\n${messageText}\n\nBest Regards,\nBietHub Platform`);
                logger.info(`SMS trial email nudge sent to ${user.email}`);
            } catch (err) {
                logger.error(`Failed to send SMS trial email nudge: ${err.message}`);
            }
        } else if (nextAction.type === 'nudge' && nextAction.channel === 'vapi') {
            try {
                const { triggerVapiCall } = require('./vapiService');
                await triggerVapiCall(user, messageText, cause, event.amount);
                logger.info(`Vapi billing call nudge executed for ${user.email || user.name}`);
            } catch (err) {
                logger.error(`Failed to execute Vapi billing call nudge: ${err.message}`);
            }
        } else if (nextAction.type === 'cancel') {
            try {
                if (user) {
                    user.isMember = false;
                    user.membershipPlan = 'none';
                    user.membershipExpiresAt = null;
                    await user.save();
                    logger.info(`Cancelled subscription for user ${user._id} due to playbook cancel execution`);
                }
            } catch (err) {
                logger.error(`Failed to cancel user subscription during intervention: ${err.message}`);
            }
        }

        logger.info(`Successfully executed playbook step [${actionKey}] for member ${memberId}`);
        
        event.status = 'processed';
        await event.save();

    } catch (error) {
        logger.error(`Error in processIntervention intervention engine: ${error.message}`);
        event.status = 'needs_review';
        await event.save();
    }
};

module.exports = {
    processIntervention
};
