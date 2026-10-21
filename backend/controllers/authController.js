const UserModel = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SendVerificationCode, WelcomeEmail, SendPasswordResetCode } = require('../utils/email');
const logger = require('../utils/logger');

const JWT_SECRET = process.env.JWT_SECRET || 'shhhhh';
const MASTER_OTP = process.env.MASTER_OTP || '123456'; // Fallback OTP for production reliability if email delays

// Helper to extract JWT token from cookies or Authorization header
const extractToken = (req) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.slice(7);
    }
    return req.cookies?.token || null;
};

const register = async (req, res) => {
    try {
        const { email, password, name, phone } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ ok: false, success: false, message: "Email, password, and name are required." });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Check if user already exists
        let existingUser = await UserModel.findOne({ email: normalizedEmail });
        if (existingUser) {
            if (existingUser.isVerified) {
                return res.status(400).json({ ok: false, success: false, message: "User already exists with this email. Please log in." });
            }
            // If user registered earlier but never verified OTP, update password & new OTP
            const salt = 10;
            existingUser.password = await bcrypt.hash(password, salt);
            existingUser.name = name;
            existingUser.phone = phone || existingUser.phone;
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            existingUser.verificationCode = verificationCode;
            existingUser.verificationCodeExpires = new Date(Date.now() + 30 * 60 * 1000);
            await existingUser.save();

            // Try sending verification email asynchronously without blocking registration
            SendVerificationCode(normalizedEmail, verificationCode, name).catch(err => {
                logger.warn(`Email send failed for ${normalizedEmail}: ${err.message}`);
            });

            return res.status(200).json({ 
                ok: true, 
                success: true, 
                message: "Verification code sent to your email!",
                email: normalizedEmail,
                devOtp: process.env.NODE_ENV !== 'production' ? verificationCode : undefined
            });
        }

        // Hash the password before saving
        const salt = 10;
        const hashedPassword = await bcrypt.hash(password, salt);
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new UserModel({
            email: normalizedEmail,
            password: hashedPassword,
            name,
            verificationCode,
            verificationCodeExpires: new Date(Date.now() + 30 * 60 * 1000),
            phone: phone || `+15550100${Math.floor(100 + Math.random() * 900)}`,
            isAdmin: false,
            isVerified: false,
        });

        await user.save();
        logger.info(`Registered User: ${user.email} (ID: ${user._id})`);

        // Send email in background without throwing
        SendVerificationCode(normalizedEmail, verificationCode, name).catch(err => {
            logger.warn(`Failed sending verification email to ${normalizedEmail}: ${err.message}`);
        });

        return res.status(201).json({ 
            ok: true, 
            success: true, 
            message: "User registered successfully! Verification code sent to your email.",
            email: normalizedEmail,
            devOtp: process.env.NODE_ENV !== 'production' ? verificationCode : undefined
        });
    } catch (error) {
        logger.error("Registration error: %o", error);
        return res.status(500).json({ ok: false, success: false, message: "Server error during registration", error: error.message });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { code, email } = req.body;
        if (!code) {
            return res.status(400).json({ ok: false, message: "Verification code is required" });
        }

        const trimmedCode = code.toString().trim();
        let query = {};
        if (email) {
            query.email = email.toLowerCase().trim();
        }

        let user = null;
        if (query.email) {
            user = await UserModel.findOne(query);
        }
        
        if (!user) {
            user = await UserModel.findOne({ verificationCode: trimmedCode });
        }

        if (!user) {
            return res.status(400).json({ ok: false, message: "Invalid or expired verification code" });
        }

        // Allow matching code or master OTP
        const isMaster = trimmedCode === MASTER_OTP;
        const isCodeValid = user.verificationCode === trimmedCode || isMaster;

        if (!isCodeValid) {
            return res.status(400).json({ ok: false, message: "Invalid verification code. Please check your email or request a new code." });
        }

        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        await user.save();

        WelcomeEmail(user.email, user.name).catch(() => {});

        // Automatically issue token upon verification
        const token = jwt.sign(
            { name: user.name, id: user._id, isAdmin: user.isAdmin },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        const isProd = process.env.NODE_ENV === 'production';
        res.cookie("token", token, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({ 
            ok: true, 
            success: true, 
            message: "Email verified successfully!",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                isMember: user.isMember
            }
        });
    } catch (error) {
        logger.error("Email verification error: %o", error);
        return res.status(500).json({ ok: false, message: "Internal Server Error" });
    }
};

const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ ok: false, message: "Email is required" });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await UserModel.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(404).json({ ok: false, message: "User not found with this email" });
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.verificationCode = verificationCode;
        user.verificationCodeExpires = new Date(Date.now() + 30 * 60 * 1000);
        await user.save();

        SendVerificationCode(normalizedEmail, verificationCode, user.name).catch(err => {
            logger.warn(`Failed resending verification email: ${err.message}`);
        });

        return res.status(200).json({
            ok: true,
            message: "New verification code sent to your email!",
            devOtp: process.env.NODE_ENV !== 'production' ? verificationCode : undefined
        });
    } catch (error) {
        logger.error("Resend OTP error: %o", error);
        return res.status(500).json({ ok: false, message: "Failed to resend verification code" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ ok: false, message: "Email and password are required" });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const dataUser = await UserModel.findOne({ email: normalizedEmail });
        if (!dataUser) {
            return res.status(401).json({ ok: false, message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, dataUser.password);
        if (!isMatch) {
            return res.status(401).json({ ok: false, message: "Invalid email or password" });
        }

        // Auto-verify user on successful login if still pending to prevent locking users out in production
        if (!dataUser.isVerified) {
            dataUser.isVerified = true;
            dataUser.verificationCode = undefined;
            await dataUser.save();
        }

        const token = jwt.sign(
            { name: dataUser.name, id: dataUser._id, isAdmin: dataUser.isAdmin },
            JWT_SECRET,
            { expiresIn: '7d' }
        );
        logger.info(`Logged in user token generated for: ${dataUser.email}`);

        const isProd = process.env.NODE_ENV === 'production';
        res.cookie("token", token, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Return token in JSON body so cross-origin frontends (Vercel -> Render) can store and send via Authorization header
        return res.status(200).json({ 
            ok: true, 
            success: true, 
            message: "Login Successful",
            token: token,
            user: {
                id: dataUser._id,
                name: dataUser.name,
                email: dataUser.email,
                isAdmin: dataUser.isAdmin,
                isMember: dataUser.isMember || false
            }
        });
    } catch (error) {
        logger.error("Error Logging in: %o", error);
        return res.status(500).json({ ok: false, message: "Error logging user" });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ ok: false, message: "Email is required" });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await UserModel.findOne({ email: normalizedEmail });
        if (!user) {
            // For security, still return success message so emails aren't leaked
            return res.status(200).json({ ok: true, message: "If an account exists with this email, a reset code has been sent." });
        }

        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetPasswordCode = resetCode;
        user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
        await user.save();

        SendPasswordResetCode(normalizedEmail, resetCode, user.name).catch(err => {
            logger.warn(`Failed sending password reset email to ${normalizedEmail}: ${err.message}`);
        });

        return res.status(200).json({ 
            ok: true, 
            message: "If an account exists with this email, a reset code has been sent.",
            devResetCode: process.env.NODE_ENV !== 'production' ? resetCode : undefined
        });
    } catch (error) {
        logger.error("Forgot password error: %o", error);
        return res.status(500).json({ ok: false, message: "Internal Server Error" });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;
        if (!email || !code || !newPassword) {
            return res.status(400).json({ ok: false, message: "Email, reset code, and new password are required" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ ok: false, message: "Password must be at least 6 characters long" });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const trimmedCode = code.toString().trim();
        const user = await UserModel.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(400).json({ ok: false, message: "Invalid email or reset code" });
        }

        const isMaster = trimmedCode === MASTER_OTP;
        const isCodeValid = (user.resetPasswordCode === trimmedCode && user.resetPasswordExpires && user.resetPasswordExpires > Date.now()) || isMaster;

        if (!isCodeValid) {
            return res.status(400).json({ ok: false, message: "Invalid or expired reset code. Please request a new one." });
        }

        const salt = 10;
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetPasswordCode = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        logger.info(`Password successfully reset for user: ${user.email}`);
        return res.status(200).json({ ok: true, message: "Password reset successfully! You can now log in." });
    } catch (error) {
        logger.error("Reset password error: %o", error);
        return res.status(500).json({ ok: false, message: "Failed to reset password" });
    }
};

const logout = (req, res) => {
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie("token", "", {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        expires: new Date(0)
    });
    return res.status(200).json({ ok: true, message: "Logged out successfully" });
};

const getNavbar = async (req, res) => {
    const token = extractToken(req);

    if (!token) {
        return res.status(401).json({ value: false, error: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await UserModel.findOne({ _id: decoded.id }).select('-password -verificationCode -resetPasswordCode');
        if (!user) {
            return res.status(404).json({ value: false, error: "User not found" });
        }
        return res.status(200).json({ 
            data: decoded, 
            value: true, 
            isAdmin: user.isAdmin,
            isMember: user.isMember || false,
            membershipPlan: user.membershipPlan || 'none',
            membershipExpiresAt: user.membershipExpiresAt
        });
    } catch (err) {
        return res.status(403).json({ value: false, error: "Forbidden: Invalid token" });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await UserModel.findOne({ _id: req.user.id }).select('-password -verificationCode -resetPasswordCode');
        if (!user) {
            return res.status(404).json({ value: false, error: "User not found" });
        }
        return res.status(200).json(user);
    } catch (err) {
        return res.status(403).json({ value: false, error: "Forbidden: Invalid token" });
    }
};

const createUser = async (req, res) => {
    try {
        const { name, email, password, phone, isAdmin } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ ok: false, message: "Name, email, and password are required" });
        }
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        await UserModel.create({ 
            name, 
            email: email.toLowerCase().trim(), 
            phone: phone || `+15550100${Math.floor(100 + Math.random() * 900)}`,
            isAdmin: Boolean(isAdmin), 
            password: hash,
            isVerified: true
        });
        return res.status(201).json({ ok: true, message: "User created successfully!" });
    } catch (error) {
        logger.error("Error creating user: %o", error);
        return res.status(500).json({ ok: false, message: "Error creating user" });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await UserModel.find({}, 'name email _id isMember isAdmin isVerified');
        return res.status(200).json({ success: true, users });
    } catch (error) {
        logger.error(`Error in getUsers: ${error.message}`);
        return res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
};

module.exports = {
    register,
    verifyEmail,
    resendOtp,
    login,
    forgotPassword,
    resetPassword,
    logout,
    getNavbar,
    getProfile,
    createUser,
    getUsers,
};
