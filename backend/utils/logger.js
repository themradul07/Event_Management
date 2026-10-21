const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Define log format for files (JSON format)
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
);

// Define console format (colorized and human-readable)
const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(
        (info) => `${info.timestamp} [${info.level}]: ${info.message}${info.stack ? '\n' + info.stack : ''}`
    )
);

// Safely ensure logs directory exists
const logDir = path.join(__dirname, '../logs');
let canWriteFiles = false;
try {
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
    fs.accessSync(logDir, fs.constants.W_OK);
    canWriteFiles = true;
} catch (err) {
    // In serverless/read-only cloud environments, filesystem writing may be restricted
    canWriteFiles = false;
}

const transports = [
    // Output to console (primary transport in cloud deployment environments)
    new winston.transports.Console({
        format: consoleFormat
    })
];

if (canWriteFiles) {
    transports.push(
        // Write all logs with level 'error' to logs/error.log
        new winston.transports.File({
            filename: path.join(logDir, 'error.log'),
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        // Write all logs with level 'info' and below to logs/combined.log
        new winston.transports.File({
            filename: path.join(logDir, 'combined.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        })
    );
}

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    transports: transports,
    exitOnError: false,
});

module.exports = logger;

