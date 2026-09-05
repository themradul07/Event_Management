const mongoose = require('mongoose');

const paymentEventSchema = new mongoose.Schema({
    event_id: { 
        type: String, 
        required: true, 
        unique: true 
    },
    member_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user', 
        required: true 
    },
    subscription_id: { 
        type: String, 
        default: 'none' 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    failure_code: { 
        type: String, 
        required: true,
        enum: [
            'card_declined_insufficient_funds',
            'card_declined_expired',
            'bank_timeout',
            'mandate_revoked',
            'checkout_abandoned',
            'invoice_overdue',
            'user_cancelled',
            'success'
        ]
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    },
    retry_count: { 
        type: Number, 
        default: 0 
    },
    source: { 
        type: String, 
        enum: ['simulator', 'webhook'], 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['pending', 'processed', 'needs_review', 'resolved'], 
        default: 'pending' 
    },
    error_description: {
        type: String,
        default: ''
    },
    diagnosis_cause: {
        type: String,
        enum: [
            'insufficient_funds',
            'card_expired',
            'bank_timeout',
            'mandate_revoked',
            'checkout_abandoned',
            'invoice_overdue',
            'user_cancelled',
            'success',
            'unknown'
        ]
    },
    diagnosis_confidence: {
        type: Number,
        default: 1.0
    },
    diagnosis_reasoning: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('PaymentEvent', paymentEventSchema);
