const mongoose = require('mongoose');

const recoveryPlaybookSchema = new mongoose.Schema({
    cause: { 
        type: String, 
        required: true, 
        unique: true 
    },
    error_codes: {
        type: [String],
        default: []
    },
    actions: [
        {
            type: { type: String, enum: ['nudge', 'retry', 'cancel'], required: true },
            channel: { type: String, enum: ['whatsapp', 'email', 'sms', 'system', 'vapi'], default: 'system' },
            delay: { type: String, default: '1m' },
            message_type: { type: String, enum: ['english', 'hinglish'], default: 'english' },
            include_update_link: { type: Boolean, default: false },
            include_reauth_link: { type: Boolean, default: false }
        }
    ],
    max_retries: { type: Number, default: 0 },
    max_nudges: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('RecoveryPlaybook', recoveryPlaybookSchema);
