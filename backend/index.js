require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const morgan = require('morgan');
const logger = require('./utils/logger');
const connectDB = require('./config/db');

// Import routers
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Import auth middleware
const { isLoggedIn } = require('./middleware/auth');

const app = express();

// Trust proxy for reverse proxy environments (Render, Railway, Heroku, Cloudflare)
app.set('trust proxy', 1);

// Database connection
connectDB();

// Setup Morgan HTTP logger to output via winston logger
const morganStream = {
    write: (message) => logger.info(message.trim())
};
app.use(morgan(':method :url :status :res[content-length] - :response-time ms', { stream: morganStream }));

// Enable full CORS for all origins (*) with credentials and preflight support
const corsOptions = {
    origin: true, // Dynamically reflects request origin (allows all origins '*' while preserving credentials/cookies)
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Cookie', 'Origin'],
    exposedHeaders: ['Set-Cookie']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Security Headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// Global Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint (used by cloud host health monitors: Render, Railway, AWS, etc.)
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        service: 'BietHub API',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// Serve static public assets
app.use(express.static(path.join(__dirname, "public")));

app.use('/', authRoutes);
app.use('/', eventRoutes);
app.use('/payforevent', isLoggedIn, paymentRoutes);

// Register public Webhook receiver (no authentication required)
const paymentController = require('./controllers/paymentController');
const vapiController = require('./controllers/vapiController');

app.post('/razorpay/webhook', paymentController.receiveWebhook);
app.post('/vapi/webhook', vapiController.handleVapiWebhook);

// Simulation API routes for /phone page
app.get('/api/vapi/simulated-call/latest', vapiController.getSimulatedCall);
app.post('/api/vapi/simulated-call/trigger', vapiController.triggerSimulatedCall);
app.post('/api/vapi/simulated-call/respond', vapiController.respondSimulatedCall);
app.post('/api/vapi/simulated-call/web-tool', vapiController.executeWebTool);

// Global Error Handler Middleware
app.use((err, req, res, next) => {
    logger.error('Unhandled request error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Server is running on port ${PORT}`);
    
    // Start Outbox Polling Event Bus Worker
    const eventBusWorker = require('./workers/eventBusWorker');
    eventBusWorker.startPolling();
});

// Graceful shutdown handling for container deployments (Render, Docker, Kubernetes)
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
    });
});

module.exports = app;