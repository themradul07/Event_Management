const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    img: {
        type: String,
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    amount: {
        type: Number,
        default: 0,
    },
    category: {
        type: String,
    },
    month: {
        type: String,
    },
    date: {
        type: Date,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    time: {
        type: String,
    },
    medium: {
        type: String,
    },
    venue: {
        type: String,
    },
    participants: [
        {
            name: String,
            id: mongoose.Schema.Types.ObjectId,
        },
    ],
    isExclusive: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
