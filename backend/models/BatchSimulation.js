const mongoose = require('mongoose');

const batchSimulationSchema = new mongoose.Schema({
    run_id: { 
        type: String, 
        required: true, 
        unique: true 
    },
    total_subscribers: { 
        type: Number, 
        required: true 
    },
    revenue_at_risk: { 
        type: Number, 
        required: true 
    },
    revenue_recovered: { 
        type: Number, 
        required: true 
    },
    recovery_rate_percent: { 
        type: Number, 
        required: true 
    },
    false_positive_cost: { 
        type: Number, 
        default: 0 
    },
    proactive_revenue_saved: {
        type: Number,
        default: 0
    },
    metrics_by_cause: { 
        type: Object, 
        required: true 
    },
    exceptions: [
        {
            member_name: { type: String, required: true },
            member_email: { type: String, required: true },
            cause: { type: String, required: true },
            reason: { type: String, required: true },
            status: { type: String, enum: ['escalated', 'lost', 'ptp_suppressed'], required: true }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('BatchSimulation', batchSimulationSchema);
