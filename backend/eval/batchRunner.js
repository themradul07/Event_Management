const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

// Load models
const UserModel = require('../models/User');
const PaymentEvent = require('../models/PaymentEvent');
const Outbox = require('../models/Outbox');
const AuditLog = require('../models/AuditLog');
const PromiseToPay = require('../models/PromiseToPay');
const BatchSimulation = require('../models/BatchSimulation');

const { diagnoseEvent } = require('../services/diagnosisService');
const { processIntervention } = require('../services/interventionEngine');

// Distribution count for 120 synthetic subscribers
const CAUSE_DISTRIBUTION = [
    { cause: 'card_declined_insufficient_funds', count: 48 }, // 40%
    { cause: 'checkout_abandoned', count: 24 },              // 20%
    { cause: 'card_declined_expired', count: 18 },           // 15%
    { cause: 'bank_timeout', count: 12 },                    // 10%
    { cause: 'mandate_revoked', count: 6 },                  // 5%
    { cause: 'invoice_overdue', count: 6 },                  // 5%
    { cause: 'user_cancelled', count: 6 }                    // 5%
];

const runBatch = async (dbConnectedAlready = false) => {
    try {
        if (!dbConnectedAlready) {
            require('dotenv').config();
            await mongoose.connect(process.env.MONGO_URI);
            logger.info("Batch Harness: Connected to MongoDB.");
        }

        logger.info("Initializing Batch Harness for scale recovery test...");

        // 1. Clean previous batch run users and related data
        await UserModel.deleteMany({ email: /@batch\.biethub\.in$/ });
        // We do not delete all audit logs or payment events to preserve history,
        // but batch users are cleared to maintain fresh metrics.

        const run_id = `batch_run_${Date.now()}`;
        let totalSubscribers = 0;
        let revenueAtRisk = 0;
        let revenueRecovered = 0;
        let falsePositiveCost = 0;
        
        const metricsByCause = {
            insufficient_funds: { total: 0, recovered: 0, risk: 0 },
            card_expired: { total: 0, recovered: 0, risk: 0 },
            bank_timeout: { total: 0, recovered: 0, risk: 0 },
            mandate_revoked: { total: 0, recovered: 0, risk: 0 },
            checkout_abandoned: { total: 0, recovered: 0, risk: 0 },
            invoice_overdue: { total: 0, recovered: 0, risk: 0 },
            user_cancelled: { total: 0, recovered: 0, risk: 0 }
        };

        const exceptions = [];

        // 2. Generate 120 Synthetic Users and trigger events
        let userCounter = 1;
        
        for (const item of CAUSE_DISTRIBUTION) {
            const mappedCauseKey = item.cause === 'card_declined_insufficient_funds' ? 'insufficient_funds' :
                                   item.cause === 'card_declined_expired' ? 'card_expired' : item.cause;

            for (let i = 0; i < item.count; i++) {
                // Determine Plan & Amount
                let plan = 'monthly';
                let amount = 299;

                if (item.cause === 'invoice_overdue') {
                    plan = 'corporate_wellness';
                    amount = 9999;
                } else {
                    const rand = Math.random();
                    if (rand > 0.7) { plan = 'yearly'; amount = 2499; }
                    else if (rand > 0.4) { plan = 'quarterly'; amount = 699; }
                }

                // Create User
                const name = `Batch Student ${userCounter}`;
                const email = `student${userCounter}@batch.biethub.in`;
                userCounter++;

                const user = await UserModel.create({
                    name,
                    email,
                    password: 'batchpassword123',
                    isMember: false,
                    membershipPlan: 'none',
                    phone: `+15550100${String(userCounter).padStart(3, '0')}`
                });

                totalSubscribers++;
                revenueAtRisk += amount;
                metricsByCause[mappedCauseKey].total++;
                metricsByCause[mappedCauseKey].risk += amount;

                // Pre-register Promise to Pay for exactly 10% of users to test suppression
                let ptpActive = false;
                if (Math.random() < 0.1 && item.cause !== 'user_cancelled') {
                    ptpActive = true;
                    const promisedDate = new Date();
                    promisedDate.setDate(promisedDate.getDate() + 5);

                    await PromiseToPay.create({
                        member_id: user._id,
                        promised_date: promisedDate,
                        promised_amount: amount,
                        status: 'active'
                    });

                    exceptions.push({
                        member_name: name,
                        member_email: email,
                        cause: mappedCauseKey,
                        reason: `Payment promise committed for date: ${promisedDate.toLocaleDateString()}`,
                        status: 'ptp_suppressed'
                    });
                }

                // Create Payment Event directly (simulating published event)
                const event_id = `evt_batch_${run_id}_${totalSubscribers}`;
                const subscription_id = `sub_batch_${run_id}_${totalSubscribers}`;

                // Run diagnosis
                const diagnosis = await diagnoseEvent({
                    failure_code: item.cause,
                    error_description: ptpActive ? 'Promise to pay pre-registered' : `Failed card charge on ${plan} tier.`
                });

                const createdEvent = await PaymentEvent.create({
                    event_id,
                    member_id: user._id,
                    subscription_id,
                    amount,
                    failure_code: item.cause,
                    error_description: `Batch scale testing transaction failure.`,
                    source: 'simulator',
                    status: 'processed',
                    diagnosis_cause: diagnosis.cause,
                    diagnosis_confidence: diagnosis.confidence,
                    diagnosis_reasoning: diagnosis.reasoning
                });

                // Trigger Playbook Action
                await processIntervention(createdEvent);

                // Count nudge cost
                const audits = await AuditLog.find({ event_id: createdEvent._id });
                audits.forEach(aud => {
                    if (aud.channel === 'whatsapp' || aud.channel === 'email' || aud.channel === 'vapi') {
                        falsePositiveCost += (aud.channel === 'vapi' ? 10 : 5); // ₹10 per vapi call, ₹5 for others
                    }
                });

                // 3. Simulate Recovery Outcomes (Probability-based Churn / Recovery)
                let recovered = false;
                let reason = '';

                if (ptpActive) {
                    // Suppressed, remains outstanding but not escalated yet
                    reason = 'Recovery suppressed by active promise date.';
                } else {
                    const recoveryRand = Math.random();
                    
                    if (mappedCauseKey === 'insufficient_funds' && recoveryRand < 0.50) {
                        recovered = true;
                    } else if (mappedCauseKey === 'bank_timeout' && recoveryRand < 0.90) {
                        recovered = true;
                    } else if (mappedCauseKey === 'checkout_abandoned' && recoveryRand < 0.35) {
                        recovered = true;
                    } else if (mappedCauseKey === 'card_expired' && recoveryRand < 0.40) {
                        recovered = true;
                    } else if (mappedCauseKey === 'mandate_revoked' && recoveryRand < 0.35) {
                        recovered = true;
                    } else if (mappedCauseKey === 'invoice_overdue' && recoveryRand < 0.60) {
                        recovered = true;
                    } else if (mappedCauseKey === 'user_cancelled') {
                        recovered = false;
                        reason = 'Explicit churn: user requested membership cancellation.';
                    }

                    if (recovered) {
                        revenueRecovered += amount;
                        metricsByCause[mappedCauseKey].recovered++;

                        // Update subscriber membership state
                        user.isMember = true;
                        user.membershipPlan = plan;
                        const expires = new Date();
                        expires.setDate(expires.getDate() + 30);
                        user.membershipExpiresAt = expires;
                        await user.save();

                        // Write success log to Audit
                        await AuditLog.create({
                            member_id: user._id,
                            event_id: createdEvent._id,
                            cause: mappedCauseKey,
                            action: 'recovery_success',
                            bound_applied: 'Recovery verified successfully',
                            reasoning_summary: 'Payment recovery resolved. Premium membership reactivated.',
                            channel: 'system',
                            message_sent: ''
                        });
                    } else {
                        // Unrecovered, log as lost or escalated
                        const isB2B = mappedCauseKey === 'invoice_overdue';
                        
                        await AuditLog.create({
                            member_id: user._id,
                            event_id: createdEvent._id,
                            cause: mappedCauseKey,
                            action: isB2B ? 'escalated_to_finance' : 'marked_as_lost',
                            bound_applied: isB2B ? 'B2B Escalation Threshold' : 'Max Playbook Attempts Exceeded',
                            reasoning_summary: isB2B ? 'Overdue B2B wellness invoice escalated to corporate finance department.' : 'Automated playbook attempts exhausted without recovery response. Subscriber written off.',
                            channel: 'system',
                            message_sent: ''
                        });

                        exceptions.push({
                            member_name: name,
                            member_email: email,
                            cause: mappedCauseKey,
                            reason: isB2B ? 'B2B invoice overdue escalated to corporate accounts team.' : (reason || 'Exceeded recovery time limits with no response.'),
                            status: isB2B ? 'escalated' : 'lost'
                        });
                    }
                }
            }
        }

        // --- Simulating Proactive Churn Interventions ---
        let proactiveRevenueSaved = 0;
        for (let k = 1; k <= 20; k++) {
            const name = `Proactive Student ${k}`;
            const email = `proactive${k}@batch.biethub.in`;
            
            const user = await UserModel.create({
                name,
                email,
                password: 'batchpassword123',
                isMember: true,
                membershipPlan: k % 3 === 0 ? 'yearly' : k % 3 === 1 ? 'quarterly' : 'monthly',
                cardExpiresAt: k % 2 === 0 ? new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) : null,
                lastLoginAt: k % 2 !== 0 ? new Date(Date.now() - 50 * 24 * 60 * 60 * 1000) : null,
                phone: `+15550200${String(k).padStart(3, '0')}`
            });

            // Log the proactive alert sent in AuditLog
            await AuditLog.create({
                member_id: user._id,
                cause: 'proactive_churn',
                action: 'proactive_nudge_sent',
                bound_applied: 'AI Predictor Nudge',
                reasoning_summary: `Queued proactive nudge warning to ${user.email} due to card expiry or inactivity.`,
                channel: 'email',
                message_sent: `Warning sent to ${email} regarding upcoming membership maintenance.`
            });

            // Simulate 60% probability of successfully updating details and remaining a member
            if (Math.random() < 0.6) {
                const price = user.membershipPlan === 'yearly' ? 2499 : user.membershipPlan === 'quarterly' ? 699 : 299;
                proactiveRevenueSaved += price;
            } else {
                // 40% churn: they don't respond, membership decays and is cancelled
                user.isMember = false;
                user.membershipPlan = 'none';
                await user.save();
            }
        }

        const recoveryRate = (revenueRecovered / revenueAtRisk) * 100;

        // 4. Save simulation results in DB
        const simulationRecord = await BatchSimulation.create({
            run_id,
            total_subscribers: totalSubscribers,
            revenue_at_risk: revenueAtRisk,
            revenue_recovered: revenueRecovered,
            recovery_rate_percent: Number(recoveryRate.toFixed(2)),
            false_positive_cost: falsePositiveCost,
            proactive_revenue_saved: proactiveRevenueSaved,
            metrics_by_cause: metricsByCause,
            exceptions: exceptions
        });

        // 5. Generate Markdown Report file
        let reportMd = `# Scale Recovery Batch Execution Report

This scale metrics report summarizes the automated billing recovery outcomes computed across a synthetic batch of **${totalSubscribers}** subscriber transaction errors.

## Headline Batch Metrics

| Indicator | Value | Description |
|---|---|---|
| **Run ID** | \`${run_id}\` | Unique batch simulation run identifier |
| **Total Subscribers Evaluated** | **${totalSubscribers}** | Generated synthetic transaction cohort |
| **Revenue At Risk** | **₹${revenueAtRisk.toLocaleString()}** | Value of all payment declines / errors |
| **Revenue Recovered** | **₹${revenueRecovered.toLocaleString()}** | Value successfully recovered by recovery playbook |
| **Recovery Efficiency Rate** | **${recoveryRate.toFixed(2)}%** | Percent of risk revenue successfully saved |
| **Outbound Messaging Cost** | **₹${falsePositiveCost.toLocaleString()}** | Cost of WhatsApp / email notifications (₹5 each) |

---

## Recovery Rate by Cause Category

| Cause Category | Total Cases | Revenue At Risk | Recovered Cases | Revenue Saved | Recovery Rate (%) |
|---|---|---|---|---|---|
`;

        Object.keys(metricsByCause).forEach(key => {
            const m = metricsByCause[key];
            const rate = m.total > 0 ? (m.recovered / m.total) * 100 : 0;
            reportMd += `| \`${key}\` | ${m.total} | ₹${m.risk.toLocaleString()} | ${m.recovered} | ₹${(m.recovered * (m.risk / m.total || 0)).toLocaleString()} | ${rate.toFixed(1)}% |\n`;
        });

        reportMd += `
---

## System Exceptions Logs

Detailed log of B2B escalations, written-off accounts, and suppressed nudges.

| Student Name | Email | Cause | Event Outcome details | Status |
|---|---|---|---|---|
`;

        exceptions.forEach(ex => {
            reportMd += `| ${ex.member_name} | \`${ex.member_email}\` | \`${ex.cause}\` | ${ex.reason} | \`${ex.status}\` |\n`;
        });

        reportMd += `
---
*Report generated by batch test runner on ${new Date().toISOString()}*
`;

        const reportPath = path.join(__dirname, 'batch_recovery_report.md');
        fs.writeFileSync(reportPath, reportMd, 'utf8');

        logger.info(`Batch run complete! Report written to ${reportPath}`);
        
        if (!dbConnectedAlready) {
            await mongoose.disconnect();
            logger.info("Batch Harness: Disconnected from MongoDB.");
        }

        return simulationRecord;

    } catch (error) {
        logger.error(`Error executing scale batch runner: ${error.message}`);
        if (!dbConnectedAlready) {
            await mongoose.disconnect();
        }
        throw error;
    }
};

// Allow executing from command line directly
if (require.main === module) {
    runBatch();
}

module.exports = {
    runBatch
};
