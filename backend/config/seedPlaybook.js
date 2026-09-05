const RecoveryPlaybook = require('../models/RecoveryPlaybook');
const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');

const defaultCodes = {
    insufficient_funds: [
        'card_declined_insufficient_funds', 
        'BAD_REQUEST_PAYMENT_DECLINED_BY_BANK',
        'BAD_REQUEST_PAYMENT_OTP_VALIDATION_FAILED',
        'BAD_REQUEST_PAYMENT_ACCOUNT_BLOCKED'
    ],
    card_expired: [
        'card_declined_expired', 
        'BAD_REQUEST_PAYMENT_CARD_EXPIRED',
        'BAD_REQUEST_PAYMENT_CARD_INVALID'
    ],
    bank_timeout: [
        'bank_timeout', 
        'BAD_REQUEST_PAYMENT_TIMED_OUT',
        'BAD_REQUEST_PAYMENT_GATEWAY_ERROR'
    ],
    mandate_revoked: [
        'mandate_revoked', 
        'BAD_REQUEST_MANDATE_CANCELLED',
        'BAD_REQUEST_PAYMENT_MANDATE_CANCELLED'
    ],
    checkout_abandoned: [
        'checkout_abandoned',
        'BAD_REQUEST_PAYMENT_CHECKOUT_ABANDONED'
    ],
    invoice_overdue: [
        'invoice_overdue'
    ],
    user_cancelled: [
        'user_cancelled',
        'BAD_REQUEST_PAYMENT_DECLINED_BY_CUSTOMER'
    ]
};

const seedPlaybooks = async () => {
    try {
        logger.info("Seeding/updating recovery playbook rules from JSON configuration...");
        const jsonPath = path.join(__dirname, 'recoveryPlaybook.json');
        
        let playbookConfig = {};
        if (fs.existsSync(jsonPath)) {
            const raw = fs.readFileSync(jsonPath, 'utf8');
            playbookConfig = JSON.parse(raw);
        } else {
            // Fallback from config folder
            const fallbackPath = path.join(__dirname, '../config/recoveryPlaybook.json');
            if (fs.existsSync(fallbackPath)) {
                const raw = fs.readFileSync(fallbackPath, 'utf8');
                playbookConfig = JSON.parse(raw);
            }
        }

        for (const cause of Object.keys(playbookConfig)) {
            const entry = playbookConfig[cause];
            await RecoveryPlaybook.findOneAndUpdate(
                { cause: cause },
                {
                    error_codes: defaultCodes[cause] || [cause],
                    actions: entry.actions || [],
                    max_retries: entry.max_retries || 0,
                    max_nudges: entry.max_nudges || 0
                },
                { upsert: true, new: true }
            );
        }
        logger.info("Default recovery playbooks successfully seeded/updated in MongoDB.");
    } catch (err) {
        logger.error(`Error seeding playbook configs: ${err.message}`);
    }
};

module.exports = seedPlaybooks;
