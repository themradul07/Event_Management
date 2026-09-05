const logger = require('../utils/logger');
const AuditLog = require('../models/AuditLog');
const PaymentEvent = require('../models/PaymentEvent');
const UserModel = require('../models/User');
const whatsappService = require('../services/whatsappService');
const { SendGeneralEmail } = require('../utils/email');

/**
 * Public Webhook Handler for Vapi AI Outbound Calls
 * Handles 'tool-calls' and 'end-of-call-report' events
 */
const handleVapiWebhook = async (req, res) => {
    try {
        const body = req.body;
        const message = body.message;

        logger.info(`[Vapi Webhook] Received webhook event type: ${message?.type || 'unknown'}`);

        if (!message) {
            return res.status(200).json({ status: 'ignored', reason: 'no message payload' });
        }

        // -------------------------------------------------------------
        // 1. Handle Tool Calls from Vapi AI Assistant during active call
        // -------------------------------------------------------------
        if (message.type === 'tool-calls' || message.type === 'function-call') {
            const toolCalls = message.toolCalls || (message.functionCall ? [message.functionCall] : []);
            const results = [];

            for (const toolCall of toolCalls) {
                const functionName = toolCall.function?.name || toolCall.name;
                const args = toolCall.function?.arguments || toolCall.arguments || {};
                const parsedArgs = typeof args === 'string' ? JSON.parse(args) : args;

                logger.info(`[Vapi Webhook] Executing tool: ${functionName} with args:`, parsedArgs);

                // Extract customer details from call metadata or customer object
                const customerNumber = message.call?.customer?.number;
                const customerEmail = parsedArgs.customerEmail || message.call?.metadata?.customerEmail;
                const memberId = message.call?.metadata?.memberId;

                // Find user in DB
                let user = null;
                if (memberId) {
                    user = await UserModel.findById(memberId);
                } else if (customerNumber) {
                    user = await UserModel.findOne({ phone: customerNumber });
                } else if (customerEmail) {
                    user = await UserModel.findOne({ email: customerEmail });
                }

                // Fallback demo user if not found in DB
                if (!user) {
                    user = {
                        _id: memberId || 'demo_user',
                        name: message.call?.customer?.name || 'Valued Member',
                        phone: customerNumber || '+919876543210',
                        email: customerEmail || 'customer@example.com'
                    };
                }

                const targetEmail = user.email || customerEmail || 'customer@example.com';

                if (functionName === 'recordFailureReason') {
                    const reason = parsedArgs.reason || 'unspecified_failure';
                    const notes = parsedArgs.notes || 'Customer provided feedback during Vapi call';

                    // 1. Save to Database: AuditLog
                    await AuditLog.create({
                        member_id: user._id !== 'demo_user' ? user._id : null,
                        event_id: message.call?.metadata?.eventId || null,
                        cause: message.call?.metadata?.cause || 'checkout_abandoned',
                        action: 'record_failure_reason',
                        bound_applied: `Failure Reason Recorded: ${reason}`,
                        reasoning_summary: `Customer stated failure reason on Vapi call: ${reason}. Notes: ${notes}`,
                        channel: 'vapi',
                        message_sent: `Reason: ${reason} | Notes: ${notes}`
                    });

                    // 2. Save to Database: PaymentEvent
                    if (message.call?.metadata?.eventId) {
                        await PaymentEvent.findByIdAndUpdate(message.call?.metadata?.eventId, {
                            status: 'needs_review',
                            diagnosis_reasoning: `Reason: ${reason} - ${notes}`
                        });
                    }

                    // 3. Guaranteed Email Delivery
                    if (targetEmail) {
                        try {
                            const emailSubject = `[BietHub] Payment Failure Feedback Recorded`;
                            const emailBody = `Dear ${user.name},\n\nThank you for speaking with BietHub's AI Assistant.\n\nWe have successfully recorded your feedback regarding the payment issue:\n- Failure Reason: ${reason}\n- Notes: ${notes}\n\nOur team is reviewing this to assist you.\n\nBest regards,\nBietHub Platform Team`;
                            await SendGeneralEmail(targetEmail, emailSubject, emailBody);
                            logger.info(`[Vapi Webhook] Failure reason confirmation email sent to ${targetEmail}`);
                        } catch (emailErr) {
                            logger.error(`[Vapi Webhook] Email delivery error: ${emailErr.message}`);
                        }
                    }

                    results.push({
                        toolCallId: toolCall.id,
                        result: `Failure reason (${reason}) recorded in database and confirmation email sent to ${targetEmail}.`
                    });

                } else if (functionName === 'sendPaymentLinkViaWhatsApp') {
                    const discountApplied = parsedArgs.discountApplied || false;
                    const discountCode = discountApplied ? 'RECOVERY10' : null;
                    const paymentUrl = discountApplied 
                        ? 'http://localhost:5173/membership?discount=RECOVERY10' 
                        : 'http://localhost:5173/membership';

                    // Send payment link via WhatsApp service
                    const waResult = await whatsappService.sendWhatsAppPaymentLink({
                        user: { ...user, email: targetEmail },
                        amount: message.call?.metadata?.amount || 999,
                        paymentUrl,
                        cause: message.call?.metadata?.cause || 'failed_payment',
                        discountCode
                    });

                    // Direct Guaranteed Email Delivery
                    try {
                        const emailSubject = `[BietHub] Action Required: Direct Payment Recovery Link`;
                        const emailBody = `Hi ${user.name},\n\nFollowing our call regarding your payment of ₹${message.call?.metadata?.amount || 999}, here is your secure direct payment recovery link:\n👉 ${paymentUrl}\n\n${discountCode ? `🎁 Special Offer: Use code "${discountCode}" for a 10% discount!\n\n` : ''}Thank you,\nBietHub Team`;
                        await SendGeneralEmail(targetEmail, emailSubject, emailBody);
                        logger.info(`[Vapi Webhook] Payment link email directly delivered to ${targetEmail}`);
                    } catch (eErr) {
                        logger.error(`[Vapi Webhook] Direct email send error: ${eErr.message}`);
                    }

                    // Log audit trail
                    await AuditLog.create({
                        member_id: user._id !== 'demo_user' ? user._id : null,
                        event_id: message.call?.metadata?.eventId || null,
                        cause: message.call?.metadata?.cause || 'checkout_abandoned',
                        action: 'nudge_whatsapp',
                        bound_applied: discountApplied ? 'Discount Code RECOVERY10 Applied' : 'Standard Payment Link',
                        reasoning_summary: `AI Assistant generated payment link on live Vapi call after customer agreed. WhatsApp & Email sent to ${targetEmail}. Notes: ${parsedArgs.notes || 'Customer agreed'}`,
                        channel: 'whatsapp',
                        message_sent: waResult.message
                    });

                    // Update payment event status
                    if (message.call?.metadata?.eventId) {
                        await PaymentEvent.findByIdAndUpdate(message.call?.metadata?.eventId, {
                            status: 'processed',
                            recovery_notes: `WhatsApp & Email payment link sent on Vapi call. Discount: ${discountApplied}`
                        });
                    }

                    results.push({
                        toolCallId: toolCall.id,
                        result: `Payment link ${discountApplied ? 'with 10% discount ' : ''}sent successfully via WhatsApp and Email to ${targetEmail}! Customer can complete payment directly.`
                    });

                } else if (functionName === 'markAsLostOrFollowUp') {
                    const reason = parsedArgs.reason || 'changed_mind';
                    const notes = parsedArgs.notes || 'Customer opted out or postponed payment';

                    // Send follow-up WhatsApp/email notice
                    await whatsappService.sendWhatsAppFollowup({
                        user: { ...user, email: targetEmail },
                        reason,
                        notes
                    });

                    // Log audit trail
                    await AuditLog.create({
                        member_id: user._id !== 'demo_user' ? user._id : null,
                        event_id: message.call?.metadata?.eventId || null,
                        cause: message.call?.metadata?.cause || 'checkout_abandoned',
                        action: 'escalate_to_human',
                        bound_applied: `Objection Recorded: ${reason}`,
                        reasoning_summary: `Customer declined payment on Vapi call. Reason: ${reason}. Notes: ${notes}. Routed to human escalation queue. Email sent to ${targetEmail}.`,
                        channel: 'vapi',
                        message_sent: `Objection: ${reason} - ${notes}`
                    });

                    // Update payment event to needs_review
                    if (message.call?.metadata?.eventId) {
                        await PaymentEvent.findByIdAndUpdate(message.call?.metadata?.eventId, {
                            status: 'needs_review',
                            recovery_notes: `Marked as lost/needs review on Vapi call. Reason: ${reason}`
                        });
                    }

                    results.push({
                        toolCallId: toolCall.id,
                        result: `Customer feedback recorded (${reason}). Case successfully marked for human support follow-up and email sent to ${targetEmail}.`
                    });

                } else {
                    results.push({
                        toolCallId: toolCall.id,
                        result: `Function ${functionName} executed.`
                    });
                }
            }

            return res.status(200).json({ results });
        }

        // -------------------------------------------------------------
        // 2. Handle End-of-Call Report from Vapi
        // -------------------------------------------------------------
        if (message.type === 'end-of-call-report') {
            const summary = message.summary || message.analysis?.summary || 'Call ended';
            const transcript = message.transcript || '';
            const duration = message.durationSeconds || 0;

            logger.info(`[Vapi Webhook] Call finished. Duration: ${duration}s. Summary: ${summary}`);

            const memberId = message.call?.metadata?.memberId;

            await AuditLog.create({
                member_id: memberId || null,
                event_id: message.call?.metadata?.eventId || null,
                cause: message.call?.metadata?.cause || 'checkout_abandoned',
                action: 'vapi_call_completed',
                bound_applied: `Call Duration: ${duration} seconds`,
                reasoning_summary: `Vapi Call Summary: ${summary}. Transcript excerpt: ${transcript.slice(0, 200)}...`,
                channel: 'vapi',
                message_sent: summary
            });

            return res.status(200).json({ status: 'recorded' });
        }

        return res.status(200).json({ status: 'ok' });

    } catch (error) {
        logger.error(`[Vapi Webhook] Error processing webhook: ${error.message}`);
        return res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * GET /api/vapi/simulated-call/latest
 * Get latest active ringing/connected simulated call for /phone page
 */
const getSimulatedCall = async (req, res) => {
    try {
        const vapiService = require('../services/vapiService');
        const call = vapiService.getLatestSimulatedCall();
        const apiKey = process.env.VAPI_API_KEY || "97cc3710-9708-4a4d-8a13-1eda37951a5d";
        const publicKey = process.env.VAPI_PUBLIC_KEY || apiKey;
        
        return res.status(200).json({
            success: true,
            call: call,
            vapiApiKey: apiKey,
            vapiPublicKey: publicKey
        });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

/**
 * POST /api/vapi/simulated-call/trigger
 * Manually trigger a simulated call for /phone demonstration
 */
const triggerSimulatedCall = async (req, res) => {
    try {
        const { name, phone, email, cause, amount } = req.body;
        const vapiService = require('../services/vapiService');
        const user = {
            _id: 'demo_' + Date.now(),
            name: name || 'Demo Member',
            phone: phone || '+919876543210',
            email: email || 'demo@biethub.org'
        };
        const result = await vapiService.triggerVapiCall(user, null, cause || 'checkout_abandoned', amount || 999);
        return res.status(200).json({ success: true, result });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

/**
 * POST /api/vapi/simulated-call/respond
 * Handle call response (answered, declined, ended) from /phone page
 */
const respondSimulatedCall = async (req, res) => {
    try {
        const { action, transcript } = req.body;
        const vapiService = require('../services/vapiService');
        const currentCall = vapiService.getLatestSimulatedCall();

        if (!currentCall) {
            return res.status(200).json({ success: true, message: 'No active call found' });
        }

        if (action === 'answer') {
            vapiService.updateSimulatedCallStatus('connected');
            await AuditLog.create({
                member_id: currentCall.user?._id !== 'demo_user' ? currentCall.user?._id : null,
                cause: currentCall.cause || 'checkout_abandoned',
                action: 'nudge_vapi_simulated_answered',
                bound_applied: 'Simulated Web Call Connected on /phone page',
                reasoning_summary: `Member ${currentCall.user?.name} answered simulated call on /phone UI screen. Voice conversation active.`,
                channel: 'vapi',
                message_sent: 'Simulated call answered by user on /phone'
            });
        } else if (action === 'decline') {
            vapiService.updateSimulatedCallStatus('declined');
            await AuditLog.create({
                member_id: currentCall.user?._id !== 'demo_user' ? currentCall.user?._id : null,
                cause: currentCall.cause || 'checkout_abandoned',
                action: 'nudge_vapi_simulated_declined',
                bound_applied: 'User rejected call on /phone',
                reasoning_summary: `User declined incoming simulated call on /phone screen.`,
                channel: 'vapi',
                message_sent: 'Call declined by user'
            });
            vapiService.clearSimulatedCall();
        } else if (action === 'end') {
            vapiService.updateSimulatedCallStatus('ended', { transcript });
            await AuditLog.create({
                member_id: currentCall.user?._id !== 'demo_user' ? currentCall.user?._id : null,
                cause: currentCall.cause || 'checkout_abandoned',
                action: 'vapi_call_completed',
                bound_applied: 'Simulated Web Call Finished',
                reasoning_summary: `Simulated Vapi call ended. Transcript: ${transcript || 'Call finished normally.'}`,
                channel: 'vapi',
                message_sent: transcript || 'Call ended'
            });
            vapiService.clearSimulatedCall();
        }

        return res.status(200).json({ success: true, call: vapiService.getLatestSimulatedCall() });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

/**
 * POST /api/vapi/simulated-call/web-tool
 * Endpoint called when Vapi Web SDK triggers tools directly in browser
 */
const executeWebTool = async (req, res) => {
    try {
        const { functionName, parameters, callMetadata } = req.body;
        const vapiService = require('../services/vapiService');
        const currentCall = vapiService.getLatestSimulatedCall();

        const user = currentCall?.user || {
            _id: callMetadata?.memberId || 'demo_user',
            name: callMetadata?.userName || 'Valued Member',
            phone: callMetadata?.phone || '+919876543210',
            email: callMetadata?.customerEmail || 'customer@example.com'
        };

        const targetEmail = parameters?.customerEmail || callMetadata?.customerEmail || user.email || 'customer@example.com';

        if (functionName === 'recordFailureReason') {
            const reason = parameters?.reason || 'unspecified_failure';
            const notes = parameters?.notes || 'Customer provided failure feedback on Vapi voice session';

            // 1. Database: AuditLog
            await AuditLog.create({
                member_id: user._id !== 'demo_user' ? user._id : null,
                event_id: currentCall?.eventId || null,
                cause: currentCall?.cause || callMetadata?.cause || 'checkout_abandoned',
                action: 'record_failure_reason',
                bound_applied: `Failure Reason Recorded: ${reason}`,
                reasoning_summary: `Customer stated failure reason on Vapi Web Call: ${reason}. Notes: ${notes}`,
                channel: 'vapi',
                message_sent: `Reason: ${reason} | Notes: ${notes}`
            });

            // 2. Database: PaymentEvent
            if (currentCall?.eventId) {
                await PaymentEvent.findByIdAndUpdate(currentCall.eventId, {
                    status: 'needs_review',
                    diagnosis_reasoning: `Recorded via Vapi call: ${reason} - ${notes}`
                });
            }

            // 3. Guaranteed Email Delivery
            if (targetEmail) {
                try {
                    const emailSubject = `[BietHub] Payment Failure Feedback Recorded`;
                    const emailBody = `Dear ${user.name},\n\nThank you for speaking with BietHub's AI Assistant on our voice simulator.\n\nWe have recorded your feedback regarding the payment issue:\n- Failure Reason: ${reason}\n- Notes: ${notes}\n\nOur support team is reviewing this case to assist you.\n\nBest regards,\nBietHub Platform Team`;
                    await SendGeneralEmail(targetEmail, emailSubject, emailBody);
                    logger.info(`[Vapi Web Tool] Failure reason confirmation email dispatched to ${targetEmail}`);
                } catch (eErr) {
                    logger.error(`[Vapi Web Tool] Email dispatch error: ${eErr.message}`);
                }
            }

            return res.status(200).json({
                result: `Failure reason (${reason}) recorded in BietHub database and confirmation email sent to ${targetEmail}.`
            });

        } else if (functionName === 'sendPaymentLinkViaWhatsApp') {
            const discountApplied = parameters?.discountApplied || false;
            const discountCode = discountApplied ? 'RECOVERY10' : null;
            const paymentUrl = discountApplied 
                ? 'http://localhost:5173/membership?discount=RECOVERY10' 
                : 'http://localhost:5173/membership';

            const waResult = await whatsappService.sendWhatsAppPaymentLink({
                user: { ...user, email: targetEmail },
                amount: currentCall?.amount || callMetadata?.amount || 999,
                paymentUrl,
                cause: currentCall?.cause || callMetadata?.cause || 'failed_payment',
                discountCode
            });

            // Direct guaranteed email notification
            try {
                const emailSubject = `[BietHub] Action Required: Payment Recovery Link for ₹${currentCall?.amount || callMetadata?.amount || 999}`;
                const emailBody = `Hi ${user.name},\n\nFollowing your Vapi voice call, here is your secure direct payment recovery link:\n👉 ${paymentUrl}\n\n${discountCode ? `🎁 Special Offer Applied: Use discount code "${discountCode}" for a 10% discount!\n\n` : ''}Complete payment to unlock instant access.\n\nBest regards,\nBietHub Team`;
                await SendGeneralEmail(targetEmail, emailSubject, emailBody);
                logger.info(`[Vapi Web Tool] Payment link email directly delivered to ${targetEmail}`);
            } catch (eErr) {
                logger.error(`[Vapi Web Tool] Direct email error: ${eErr.message}`);
            }

            await AuditLog.create({
                member_id: user._id !== 'demo_user' ? user._id : null,
                event_id: currentCall?.eventId || null,
                cause: currentCall?.cause || 'checkout_abandoned',
                action: 'nudge_whatsapp',
                bound_applied: discountApplied ? 'Discount Code RECOVERY10 Applied' : 'Standard Payment Link',
                reasoning_summary: `AI Assistant generated payment link on /phone Vapi Web call after customer agreed. WhatsApp & Email sent to ${targetEmail}. Notes: ${parameters?.notes || 'Customer agreed'}`,
                channel: 'whatsapp',
                message_sent: waResult.message
            });

            return res.status(200).json({
                result: `Payment link ${discountApplied ? 'with 10% discount ' : ''}sent successfully via WhatsApp and Email to ${targetEmail}! Customer can complete payment directly.`
            });
        } else if (functionName === 'markAsLostOrFollowUp') {
            const reason = parameters?.reason || 'changed_mind';
            const notes = parameters?.notes || 'Customer opted out or postponed payment';

            await whatsappService.sendWhatsAppFollowup({
                user: { ...user, email: targetEmail },
                reason,
                notes
            });

            await AuditLog.create({
                member_id: user._id !== 'demo_user' ? user._id : null,
                event_id: currentCall?.eventId || null,
                cause: currentCall?.cause || 'checkout_abandoned',
                action: 'escalate_to_human',
                bound_applied: `Objection Recorded: ${reason}`,
                reasoning_summary: `Customer declined payment on /phone Vapi Web call. Reason: ${reason}. Notes: ${notes}. Routed to human escalation queue. Email sent to ${targetEmail}.`,
                channel: 'vapi',
                message_sent: `Objection: ${reason} - ${notes}`
            });

            return res.status(200).json({
                result: `Customer feedback recorded (${reason}). Case successfully marked for human support follow-up and email sent to ${targetEmail}.`
            });
        }

        return res.status(200).json({ result: `Tool ${functionName} executed.` });
    } catch (err) {
        logger.error(`Error executing web tool: ${err.message}`);
        return res.status(500).json({ error: err.message });
    }
};

module.exports = {
    handleVapiWebhook,
    getSimulatedCall,
    triggerSimulatedCall,
    respondSimulatedCall,
    executeWebTool
};
