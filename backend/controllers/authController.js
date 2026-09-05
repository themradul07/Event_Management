const UserModel = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SendVerificationCode, WelcomeEmail } = require('../utils/email');
const logger = require('../utils/logger');

const JWT_SECRET = process.env.JWT_SECRET || 'shhhhh';

const register = async (req, res) => {
    try {
        const { email, password, name, phone } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ success: false, message: "Email, password, and name are required." });
        }

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists. Please login." });
        }

        // Hash the password before saving
        const salt = 10;
        const hashedPassword = await bcrypt.hash(password, salt);
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Create new user (isAdmin is explicitly false for public registration)
        const user = new UserModel({
            email,
            password: hashedPassword,
            name,
            verificationCode,
            phone: phone || `+15550100${Math.floor(100 + Math.random() * 900)}`,
            isAdmin: false,
        });

        logger.info(`Registered User: ${user.email} (ID: ${user._id})`);

        await user.save();
        await SendVerificationCode(email, verificationCode, name);

        return res.status(201).json({ ok: true, message: "User registered successfully!" });
    } catch (error) {
        logger.error("Registration error: %o", error);
        return res.status(500).json({ ok: false, message: "Server error during registration", error: error.message });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) {
            return res.status(400).json({ ok: false, message: "Verification code is required" });
        }
        const user = await UserModel.findOne({ verificationCode: code });
        
        if (!user) {
            return res.status(400).json({ ok: false, message: "Invalid or Expired Code" });
        }

        user.isVerified = true;
        user.verificationCode = undefined;
        await user.save();

        await WelcomeEmail(user.email, user.name);

        return res.status(200).json({ ok: true, message: "Code Verified Successfully" });
    } catch (error) {
        logger.error("Email verification error: %o", error);
        return res.status(500).json({ ok: false, message: "Internal Server Error" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ ok: false, message: "Email and password are required" });
        }

        const dataUser = await UserModel.findOne({ email });
        if (!dataUser) {
            return res.status(401).json({ ok: false, message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, dataUser.password);
        if (!isMatch) {
            return res.status(401).json({ ok: false, message: "Invalid email or password" });
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

        return res.status(200).json({ ok: true, message: "Login Successful" });
    } catch (error) {
        logger.error("Error Logging in: %o", error);
        return res.status(500).json({ ok: false, message: "Error logging user" });
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
    return res.status(200).json({ message: "Logged out successfully" });
};

const getNavbar = async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ value: false, error: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        logger.debug("Decoded Navbar Token: %o", decoded);
        const user = await UserModel.findOne({ _id: decoded.id }).select('-password -verificationCode');
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
        const user = await UserModel.findOne({ _id: req.user.id }).select('-password -verificationCode');
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
            email, 
            phone: phone || `+15550100${Math.floor(100 + Math.random() * 900)}`,
            isAdmin: Boolean(isAdmin), 
            password: hash 
        });
        return res.status(201).json({ ok: true, message: "User created successfully!" });
    } catch (error) {
        logger.error("Error creating user: %o", error);
        return res.status(500).json({ ok: false, message: "Error creating user" });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await UserModel.find({}, 'name email _id isMember isAdmin');
        return res.status(200).json({ success: true, users });
    } catch (error) {
        logger.error(`Error in getUsers: ${error.message}`);
        return res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
};

module.exports = {
    register,
    verifyEmail,
    login,
    logout,
    getNavbar,
    getProfile,
    createUser,
    getUsers,
};
