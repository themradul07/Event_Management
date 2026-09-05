let currentSimulatedCall = null;

const getLatestSimulatedCall = () => {
    return currentSimulatedCall;
};

const setLatestSimulatedCall = (callData) => {
    currentSimulatedCall = {
        id: 'sim_call_' + Date.now(),
        timestamp: new Date().toISOString(),
        status: 'ringing', // 'ringing', 'connected', 'ended', 'declined'
        ...callData
    };
    return currentSimulatedCall;
};

const updateSimulatedCallStatus = (status, details = {}) => {
    if (currentSimulatedCall) {
        currentSimulatedCall.status = status;
        currentSimulatedCall.updatedAt = new Date().toISOString();
        if (details) {
            currentSimulatedCall.details = { ...(currentSimulatedCall.details || {}), ...details };
        }
    }
    return currentSimulatedCall;
};

const clearSimulatedCall = () => {
    currentSimulatedCall = null;
};

const triggerVapiCall = async (user, messageText, cause, amount, eventId = null) => {
    try {
        const apiKey = process.env.VAPI_API_KEY || "97cc3710-9708-4a4d-8a13-1eda37951a5d";
        const assistantId = process.env.VAPI_ASSISTANT_ID || null;
        const phoneNumberId = process.env.VAPI_PHONE_NUMBER_ID || null; 
        const serverUrl = process.env.VAPI_SERVER_URL || process.env.NGROK_URL || "https://cake-plethora-bonsai.ngrok-free.dev/vapi/webhook";

        const userName = user?.name || "Valued Member";
        const phoneNumber = user?.phone || "+919876543210";
        const userEmail = user?.email || "customer@example.com";
        const userId = user?._id?.toString() || "demo_user";

        const payload = {
            customer: {
                number: phoneNumber,
                name: userName
            },
            metadata: {
                memberId: userId,
                customerEmail: userEmail,
                cause: cause || "checkout_abandoned",
                amount: amount || 999,
                eventId: eventId
            }
        };

        if (phoneNumberId) {
            payload.phoneNumberId = phoneNumberId;
        }

        if (assistantId) {
            payload.assistantId = assistantId;
        } else {
            // Program full transient Vapi AI Assistant tuned for short, quick interactions & tool execution
            payload.assistant = {
                name: "BietHub Payment Recovery AI",
                serverUrl: serverUrl,
                firstMessage: messageText || `Hi ${userName}, this is BietHub regarding your failed payment of ₹${amount || 999}. Could you quickly tell me what caused the failure?`,
                model: {
                    provider: "openai",
                    model: "gpt-4o",
                    messages: [
                        {
                            role: "system",
                            content: `You are BietHub's AI Payment Recovery Assistant calling ${userName} regarding a failed payment of ₹${amount || 999} (Reason: ${cause || 'checkout abandoned'}, Email: ${userEmail}).

CRITICAL INSTRUCTIONS:
1. BE EXTREMELY CRISP & QUICK. Keep all spoken responses under 1 to 2 short sentences.
2. Inform the customer clearly of their failed payment of ₹${amount || 999} and ask for the failure reason if they haven't provided it.
3. NEVER SPEAK OR READ ALOUD ANY WEBSITE URL. Simply say "BietHub". Never pronounce 'http', 'www', 'localhost', or '.com'.
4. IF THE USER WANTS TO PAY (or agrees to receive the link/website):
   - YOU MUST SAY: "I am going to send you a WhatsApp link right now."
   - IMMEDIATELY call the tool 'sendPaymentLinkViaWhatsApp' (offer 10% discount code 'RECOVERY10' if price was an issue).
5. When the customer states ANY reason for failure (e.g. bank error, card declined, price issue, forgot, changed mind):
   - ALWAYS call the tool 'recordFailureReason' with reason, notes, and customerEmail ("${userEmail}").
6. If the customer opts out or wants human assistance:
   - Call the tool 'markAsLostOrFollowUp' with reason and notes.
7. Always ensure the email address "${userEmail}" is passed to tools so that notification emails are delivered immediately.`
                        }
                    ],
                    tools: [
                        {
                            type: "function",
                            async: false,
                            function: {
                                name: "recordFailureReason",
                                description: "Records the customer's stated payment failure reason directly into the BietHub database and sends an email notification.",
                                parameters: {
                                    type: "object",
                                    properties: {
                                        reason: {
                                            type: "string",
                                            description: "Primary reason for failure (e.g. gateway_error, card_declined, price_issue, forgot, changed_mind, other)."
                                        },
                                        notes: {
                                            type: "string",
                                            description: "Detailed customer feedback or comments."
                                        },
                                        customerEmail: {
                                            type: "string",
                                            description: "Customer email address to ensure email delivery."
                                        }
                                    },
                                    required: ["reason"]
                                }
                            }
                        },
                        {
                            type: "function",
                            async: false,
                            function: {
                                name: "sendPaymentLinkViaWhatsApp",
                                description: "Generates a direct payment recovery link and dispatches it via WhatsApp and email when customer agrees to pay.",
                                parameters: {
                                    type: "object",
                                    properties: {
                                        discountApplied: {
                                            type: "boolean",
                                            description: "Set to true if 10% discount code (RECOVERY10) was offered and accepted."
                                        },
                                        notes: {
                                            type: "string",
                                            description: "Summary of customer feedback or notes."
                                        },
                                        customerEmail: {
                                            type: "string",
                                            description: "Customer email address for guaranteed email delivery."
                                        }
                                    },
                                    required: ["discountApplied"]
                                }
                            }
                        },
                        {
                            type: "function",
                            async: false,
                            function: {
                                name: "markAsLostOrFollowUp",
                                description: "Marks recovery attempt as lost or schedules human support follow-up, saving feedback to database and sending email.",
                                parameters: {
                                    type: "object",
                                    properties: {
                                        reason: {
                                            type: "string",
                                            enum: ["technical_issue", "price_issue", "changed_mind", "other"],
                                            description: "Primary reason for declining payment."
                                        },
                                        notes: {
                                            type: "string",
                                            description: "Detailed customer feedback."
                                        },
                                        customerEmail: {
                                            type: "string",
                                            description: "Customer email address."
                                        }
                                    },
                                    required: ["reason"]
                                }
                            }
                        }
                    ]
                },
                voice: {
                    provider: "11labs",
                    voiceId: "21m00Tcm4TlvDq8ikWAM"
                }
            };
        }

        // Always register simulation object so /phone page can pick it up
        const simulatedCallData = setLatestSimulatedCall({
            user: {
                _id: userId,
                name: userName,
                phone: phoneNumber,
                email: userEmail
            },
            cause: cause || "checkout_abandoned",
            amount: amount || 999,
            eventId: eventId,
            messageText: messageText || `Hello ${userName}, this is BietHub calling regarding your incomplete subscription payment of ₹${amount || 999}.`,
            payload: payload
        });

        logger.info(`[Vapi Service] Initiating Vapi call to ${userName} (${phoneNumber})`);
        logger.info(`[Vapi Service] Simulated call created with ID: ${simulatedCallData.id} for /phone page`);

        // Also trigger fallback email/WhatsApp notification
        if (userEmail) {
            try {
                const link = "http://localhost:5173/membership";
                await whatsappService.sendWhatsAppPaymentLink({
                    user,
                    amount: amount || 999,
                    paymentUrl: link,
                    cause: cause || 'subscription_issue'
                });
            } catch (notifyErr) {
                logger.error(`[Vapi Service] Pre-call notification error: ${notifyErr.message}`);
            }
        }

        // Live API execution check if VAPI_ENABLE_LIVE_CALLS is true
        const enableLiveCalls = process.env.VAPI_ENABLE_LIVE_CALLS === 'true';

        if (enableLiveCalls && apiKey && apiKey !== "97cc3710-9708-4a4d-8a13-1eda37951a5d") {
            try {
                const response = await fetch("https://api.vapi.ai/call", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${apiKey}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (!response.ok) {
                    logger.warn(`[Vapi Service] Vapi API returned status ${response.status}: ${JSON.stringify(data)}`);
                    return { success: false, msg: data.message || `Status ${response.status}`, data, simulatedCall: simulatedCallData };
                }

                logger.info(`[Vapi Service] Live Vapi call initiated successfully! Call ID: ${data.id}`);
                return { success: true, callId: data.id, data, simulatedCall: simulatedCallData };
            } catch (apiErr) {
                logger.error(`[Vapi Service] Failed live Vapi HTTP call: ${apiErr.message}`);
            }
        }

        logger.info(`[Vapi Service] Call ready for /phone simulator page`);
        return { 
            success: true, 
            msg: "Vapi call payload generated & ready on /phone simulator.",
            serverUrl: serverUrl,
            payload: payload,
            simulatedCall: simulatedCallData
        };

    } catch (err) {
        logger.error(`Error in Vapi service: ${err.message}`);
        throw err;
    }
};

module.exports = {
    triggerVapiCall,
    getLatestSimulatedCall,
    setLatestSimulatedCall,
    updateSimulatedCallStatus,
    clearSimulatedCall
};
