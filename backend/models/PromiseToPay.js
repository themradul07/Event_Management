const mongoose = require('mongoose');

const promiseToPaySchema = new mongoose.Schema({
    member_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user', 
        required: true 
    },
    promised_date: { 
        type: Date, 
        required: true 
    },
    promised_amount: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['active', 'fulfilled', 'missed'], 
        default: 'active' 
    }
}, { timestamps: true });

module.exports = mongoose.model('PromiseToPay', promiseToPaySchema);
