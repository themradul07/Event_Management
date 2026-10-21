const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            logger.error("FATAL CONFIG ERROR: process.env.MONGO_URI is missing or undefined! Please set MONGO_URI in your cloud deployment dashboard.");
            process.exit(1);
        }
        const conn = await mongoose.connect(process.env.MONGO_URI);
        logger.info(`MongoDB Connected: ${conn.connection.host}`);
        
        // Seed default playbook config rules
        const seedPlaybooks = require('./seedPlaybook');
        await seedPlaybooks();
    } catch (error) {
        logger.error(`MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;