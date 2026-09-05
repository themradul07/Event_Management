const logger = require('../utils/logger');

// Deterministic map for structured failure codes
const DETERMINISTIC_MAP = {
    'card_declined_insufficient_funds': 'insufficient_funds',
    'BAD_REQUEST_PAYMENT_DECLINED_BY_BANK': 'insufficient_funds',
    'BAD_REQUEST_PAYMENT_OTP_VALIDATION_FAILED': 'insufficient_funds',
    'BAD_REQUEST_PAYMENT_ACCOUNT_BLOCKED': 'insufficient_funds',
    'card_declined_expired': 'card_expired',
    'BAD_REQUEST_PAYMENT_CARD_EXPIRED': 'card_expired',
    'BAD_REQUEST_PAYMENT_CARD_INVALID': 'card_expired',
    'bank_timeout': 'bank_timeout',
    'BAD_REQUEST_PAYMENT_TIMED_OUT': 'bank_timeout',
    'BAD_REQUEST_PAYMENT_GATEWAY_ERROR': 'bank_timeout',
    'mandate_revoked': 'mandate_revoked',
    'BAD_REQUEST_MANDATE_CANCELLED': 'mandate_revoked',
    'BAD_REQUEST_PAYMENT_MANDATE_CANCELLED': 'mandate_revoked',
    'checkout_abandoned': 'checkout_abandoned',
    'BAD_REQUEST_PAYMENT_CHECKOUT_ABANDONED': 'checkout_abandoned',
    'invoice_overdue': 'invoice_overdue',
    'user_cancelled': 'user_cancelled',
    'BAD_REQUEST_PAYMENT_DECLINED_BY_CUSTOMER': 'user_cancelled',
};

/**
 * Local NLP rules-based classifier for ambiguous descriptions and context.
 */
const runLocalNLP = (text) => {
    const lowercaseText = text.toLowerCase();

    // 1. Insufficient Funds
    if (
        lowercaseText.includes('insufficient') ||
        lowercaseText.includes('balance') ||
        lowercaseText.includes('no money') ||
        lowercaseText.includes('low funds') ||
        lowercaseText.includes('not enough') ||
        (lowercaseText.includes('decline') && lowercaseText.includes('funds'))
    ) {
        return {
            cause: 'insufficient_funds',
            confidence: 0.85,
            reasoning: 'Heuristics identified keywords representing low account balance or insufficient funds.'
        };
    }

    // 2. Card Expired
    if (
        lowercaseText.includes('expired') ||
        lowercaseText.includes('expiration') ||
        lowercaseText.includes('validity') ||
        lowercaseText.includes('new card') ||
        lowercaseText.includes('expiry')
    ) {
        return {
            cause: 'card_expired',
            confidence: 0.90,
            reasoning: 'Heuristics matched card expiration indicators.'
        };
    }

    // 3. Bank Timeout
    if (
        lowercaseText.includes('timeout') ||
        lowercaseText.includes('timed out') ||
        lowercaseText.includes('crashed') ||
        lowercaseText.includes('network') ||
        lowercaseText.includes('slow server') ||
        lowercaseText.includes('gateway')
    ) {
        return {
            cause: 'bank_timeout',
            confidence: 0.80,
            reasoning: 'Heuristics matched transient bank gateway timeout or network error indicators.'
        };
    }

    // 4. Mandate Revoked
    if (
        lowercaseText.includes('mandate') ||
        lowercaseText.includes('revoked') ||
        lowercaseText.includes('authorization') ||
        lowercaseText.includes('unauthorized') ||
        lowercaseText.includes('cancel auto')
    ) {
        return {
            cause: 'mandate_revoked',
            confidence: 0.85,
            reasoning: 'Heuristics detected indicators of canceled auto-debit billing mandate.'
        };
    }

    // 5. Checkout Abandoned
    if (
        lowercaseText.includes('abandoned') ||
        lowercaseText.includes('left') ||
        lowercaseText.includes('incomplete') ||
        lowercaseText.includes('never completed') ||
        lowercaseText.includes('timed out before checkout')
    ) {
        return {
            cause: 'checkout_abandoned',
            confidence: 0.80,
            reasoning: 'Heuristics matched incomplete checkout or order abandonment behaviors.'
        };
    }

    // 6. Invoice Overdue
    if (
        lowercaseText.includes('invoice') ||
        lowercaseText.includes('receivable') ||
        lowercaseText.includes('b2b') ||
        lowercaseText.includes('corporate') ||
        lowercaseText.includes('overdue')
    ) {
        return {
            cause: 'invoice_overdue',
            confidence: 0.90,
            reasoning: 'Heuristics identified indicators relating to corporate B2B wellness invoice overdue billing.'
        };
    }

    // 7. User Cancelled
    if (
        lowercaseText.includes('cancel') ||
        lowercaseText.includes('churn') ||
        lowercaseText.includes('stop') ||
        lowercaseText.includes('no longer need') ||
        lowercaseText.includes('leaving') ||
        lowercaseText.includes('unsubscribed')
    ) {
        return {
            cause: 'user_cancelled',
            confidence: 0.95,
            reasoning: 'Heuristics matched explicit user requests to cancel subscription (active churn).'
        };
    }

    // Fallback: Default with low confidence (threshold < 0.7 triggers needs_review)
    return {
        cause: 'unknown',
        confidence: 0.40,
        reasoning: 'Ambiguous error context with no clear keyword indicators. Routed to manual approval queue.'
    };
};

/**
 * Main diagnosis method.
 */
const diagnoseEvent = async (eventPayload, chatHistory = '') => {
    const code = eventPayload.failure_code;

    // A. Check if error code belongs to any dynamically grouped playbook cause (Milestone 7 Control Panel)
    try {
        const RecoveryPlaybook = require('../models/RecoveryPlaybook');
        const dynamicMatch = await RecoveryPlaybook.findOne({ error_codes: code });
        if (dynamicMatch) {
            return {
                cause: dynamicMatch.cause,
                confidence: 1.0,
                reasoning: `Matched administrator grouping rule mapping error code '${code}' to cause '${dynamicMatch.cause}'`
            };
        }
    } catch (err) {
        logger.error(`Error querying dynamic error code mapping from DB: ${err.message}`);
    }

    // B. Check if it's deterministic fallback
    if (code && DETERMINISTIC_MAP[code]) {
        return {
            cause: DETERMINISTIC_MAP[code],
            confidence: 1.0,
            reasoning: `Deterministic match for structured Razorpay code: ${code}`
        };
    }

    // B. Check if it's generic success
    if (code === 'success') {
        return {
            cause: 'success',
            confidence: 1.0,
            reasoning: 'Simulated/webhook checkout payment completed successfully.'
        };
    }

    // C. Perform LLM classification or Heuristic Classifier on generic error messages
    const contextText = `${eventPayload.error_description || ''} ${chatHistory || ''}`.trim();

    if (!contextText) {
        return {
            cause: 'unknown',
            confidence: 0.50,
            reasoning: 'No description or interaction logs provided. Unable to determine failure cause.'
        };
    }

    // Call real Gemini API if configured
    if (process.env.GEMINI_API_KEY) {
        try {
            const { GoogleGenAI } = require('@google/generative-ai');
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
            const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

            const prompt = `
You are an expert financial billing analyst. Analyze the following payment failure/user context and classify it into one of these causes:
- 'insufficient_funds' (customer has insufficient account balance)
- 'card_expired' (card validity is expired)
- 'bank_timeout' (transient network or gateway crash)
- 'mandate_revoked' (auto-charge mandate cancelled by bank or user)
- 'checkout_abandoned' (user left the checkout page without completing order)
- 'invoice_overdue' (B2B corporate invoice unpaid)
- 'user_cancelled' (active user churn/request to stop membership)
- 'unknown' (none of the above)

Context: "${contextText}"

Return ONLY a valid JSON object matching this schema:
{
  "cause": "insufficient_funds" | "card_expired" | "bank_timeout" | "mandate_revoked" | "checkout_abandoned" | "invoice_overdue" | "user_cancelled" | "unknown",
  "confidence": <number between 0.0 and 1.0 representing confidence>,
  "reasoning": "Brief single-sentence explanation of why it was classified this way"
}
`;
            const result = await model.generateContent(prompt);
            const responseText = result.response.text();
            
            // Clean markdown blocks if returned
            const cleanJson = responseText.replace(/```json/i, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleanJson);
            
            logger.info(`Gemini API Diagnosis Successful: ${parsed.cause} (conf: ${parsed.confidence})`);
            return {
                cause: parsed.cause || 'unknown',
                confidence: parsed.confidence || 0.5,
                reasoning: `[Gemini AI] ${parsed.reasoning || 'Classified using LLM context analyzer.'}`
            };
        } catch (error) {
            logger.warn(`Gemini API classification failed: ${error.message}. Falling back to local NLP.`);
        }
    }

    // Run local heuristics
    const diagnosis = runLocalNLP(contextText);
    logger.debug(`Local NLP Heuristics Diagnosis: ${diagnosis.cause} (conf: ${diagnosis.confidence})`);
    return diagnosis;
};

module.exports = {
    diagnoseEvent
};
