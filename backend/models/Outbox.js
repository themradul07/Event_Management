const mongoose = require('mongoose');

const outboxSchema = new mongoose.Schema({
    event_id: { 
        type: String, 
        required: true, 
        unique: true 
    },
    payload: { 
        type: Object, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['pending', 'published', 'failed'], 
        default: 'pending' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Outbox', outboxSchema);
