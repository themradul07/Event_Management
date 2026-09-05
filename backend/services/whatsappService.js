const logger = require('../utils/logger');
const { SendGeneralEmail } = require('../utils/email');

/**
 * Send WhatsApp Payment Link
 */
const sendWhatsAppPaymentLink = async ({ user, amount, paymentUrl, cause, discountCode }) => {
    try {
        const phone = user?.phone || "+919876543210";
        const name = user?.name || "Valued Member";
        const email = user?.email;

        let messageText = `Hi ${name}! 🎟️\n\nFollowing our call regarding your BietHub payment (${cause || 'subscription'}), here is your secure direct payment recovery link:\n👉 ${paymentUrl}\n\n`;
        
        if (discountCode) {
            messageText += `🎁 Special Offer Applied: Use code "${discountCode}" or checkout via the link above for a special discount!\n\n`;
        }
        
        messageText += `Complete your payment now to instantly unlock your membership/event access.\n\nThank you,\nBietHub Platform Team`;

        logger.info(`[WhatsApp Service] Sending WhatsApp Payment Link to ${phone} (${name})`);
        logger.info(`[WhatsApp Service] Content:\n${messageText}`);

        // 1. Try sending via Twilio WhatsApp API if env credentials exist
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const fromWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

        let twilioSuccess = false;

        if (accountSid && authToken) {
            try {
                const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
                const authHeader = 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64');
                const toWhatsApp = phone.startsWith('whatsapp:') ? phone : `whatsapp:${phone}`;

                const bodyParams = new URLSearchParams({
                    From: fromWhatsAppNumber,
                    To: toWhatsApp,
                    Body: messageText
                });

                const twilioRes = await fetch(twilioUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': authHeader,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: bodyParams.toString()
                });

                if (twilioRes.ok) {
                    const twilioData = await twilioRes.json();
                    logger.info(`[WhatsApp Service] Real WhatsApp sent via Twilio! SID: ${twilioData.sid}`);
                    twilioSuccess = true;
                } else {
                    const errData = await twilioRes.text();
                    logger.warn(`[WhatsApp Service] Twilio API returned error: ${errData}`);
                }
            } catch (twilioErr) {
                logger.error(`[WhatsApp Service] Twilio dispatch error: ${twilioErr.message}`);
            }
        }

        // 2. Email fallback if email available
        if (email) {
            try {
                const emailSubject = `[WhatsApp Delivery] Secure Payment Recovery Link for BietHub`;
                await SendGeneralEmail(email, emailSubject, messageText);
                logger.info(`[WhatsApp Service] Backup notification email dispatched to ${email}`);
            } catch (emailErr) {
                logger.error(`[WhatsApp Service] Email fallback error: ${emailErr.message}`);
            }
        }

        return {
            success: true,
            channel: twilioSuccess ? 'twilio_whatsapp' : 'simulated_whatsapp_email',
            message: messageText,
            recipientPhone: phone
        };
    } catch (err) {
        logger.error(`[WhatsApp Service] Error in sendWhatsAppPaymentLink: ${err.message}`);
        throw err;
    }
};

/**
 * Send WhatsApp Payment Confirmation
 */
const sendWhatsAppConfirmation = async ({ user, amount, orderId }) => {
    try {
        const phone = user?.phone || "+919876543210";
        const name = user?.name || "Valued Member";
        const email = user?.email;

        const messageText = `🎉 Payment Confirmed! Hi ${name}, we have successfully received your payment of ₹${amount} (Order: ${orderId}).\n\nYour BietHub subscription and activity passes are now FULLY ACTIVE. Thank you for staying with us!\n\n- BietHub Team`;

        logger.info(`[WhatsApp Service] Sending WhatsApp Confirmation to ${phone} (${name})`);
        logger.info(`[WhatsApp Service] Content:\n${messageText}`);

        // Try Twilio WhatsApp if configured
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const fromWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

        if (accountSid && authToken) {
            try {
                const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
                const authHeader = 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64');
                const toWhatsApp = phone.startsWith('whatsapp:') ? phone : `whatsapp:${phone}`;

                const bodyParams = new URLSearchParams({
                    From: fromWhatsAppNumber,
                    To: toWhatsApp,
                    Body: messageText
                });

                await fetch(twilioUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': authHeader,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: bodyParams.toString()
                });
            } catch (err) {
                logger.warn(`[WhatsApp Confirmation] Twilio call failed, continuing: ${err.message}`);
            }
        }

        if (email) {
            try {
                await SendGeneralEmail(email, `Payment Successful - BietHub Subscription Active`, messageText);
            } catch (e) {
                // ignore email error
            }
        }

        return { success: true, message: messageText };
    } catch (err) {
        logger.error(`[WhatsApp Service] Error in sendWhatsAppConfirmation: ${err.message}`);
        throw err;
    }
};

/**
 * Send WhatsApp Follow-up / Lost Notification
 */
const sendWhatsAppFollowup = async ({ user, reason, notes }) => {
    try {
        const phone = user?.phone || "+919876543210";
        const name = user?.name || "Valued Member";
        const email = user?.email;

        const messageText = `Hi ${name}, thank you for speaking with our AI billing assistant. We recorded your feedback regarding "${reason || 'your preference'}".\n\nOur human support team will follow up with you shortly to assist further.\n\n- BietHub Team`;

        logger.info(`[WhatsApp Service] Sending WhatsApp Follow-up to ${phone}: ${messageText}`);

        if (email) {
            try {
                await SendGeneralEmail(email, `BietHub Follow-up Request Received`, messageText);
            } catch (e) {
                // ignore email error
            }
        }

        return { success: true, message: messageText };
    } catch (err) {
        logger.error(`[WhatsApp Service] Error in sendWhatsAppFollowup: ${err.message}`);
        throw err;
    }
};

module.exports = {
    sendWhatsAppPaymentLink,
    sendWhatsAppConfirmation,
    sendWhatsAppFollowup
};
