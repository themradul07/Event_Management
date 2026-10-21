const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    participated: {
        type: Array,
        default: [],
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationCode: {
        type: String,
        index: { sparse: true },
    },
    verificationCodeExpires: {
        type: Date,
    },
    resetPasswordCode: {
        type: String,
        index: { sparse: true },
    },
    resetPasswordExpires: {
        type: Date,
    },
    phone: {
        type: String,
    },
    isMember: {
        type: Boolean,
        default: false,
    },
    membershipPlan: {
        type: String,
        enum: ['none', 'monthly', 'quarterly', 'yearly', 'corporate_wellness'],
        default: 'none',
    },
    membershipExpiresAt: {
        type: Date,
    },
    cardExpiresAt: {
        type: Date,
    },
    lastLoginAt: {
        type: Date,
    },
}, { timestamps: true });

module.exports = mongoose.model("user", userSchema);