const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    order_id: { 
        type: String, 
        required: true, 
        unique: true 
    },
    member_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user', 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    planType: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['created', 'paid', 'failed'], 
        default: 'created' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
