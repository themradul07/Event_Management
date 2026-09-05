const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const UserModel = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'shhhhh';

function isLoggedIn(req, res, next) {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({ success: false, value: false, error: 'Unauthorized: No token provided' });
    }

    try {
        req.user = jwt.verify(token, JWT_SECRET);
        logger.info(`Authenticated User: ${req.user.name || req.user.email} (ID: ${req.user.id})`);
        next();
    } catch (err) {
        logger.warn(`Failed token verification: ${err.message}`);
        return res.status(401).json({ success: false, value: false, error: 'Unauthorized: Invalid or expired token' });
    }
}

async function isAdmin(req, res, next) {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ success: false, error: 'Unauthorized: Login required' });
    }

    try {
        const user = await UserModel.findById(req.user.id);
        if (!user || !user.isAdmin) {
            return res.status(403).json({ success: false, error: 'Forbidden: Admin access required' });
        }
        next();
    } catch (err) {
        logger.error(`Admin check failed: ${err.message}`);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}

module.exports = { isLoggedIn, isAdmin };

