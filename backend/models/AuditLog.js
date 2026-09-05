const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    member_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user', 
        required: true 
    },
    event_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'PaymentEvent' 
    },
    cause: { 
        type: String, 
        required: true 
    },
    action: { 
        type: String, 
        required: true 
    },
    bound_applied: { 
        type: String, 
        required: true 
    },
    reasoning_summary: { 
        type: String, 
        required: true 
    },
    channel: { 
        type: String, 
        default: 'system' 
    },
    message_sent: { 
        type: String, 
        default: '' 
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);
