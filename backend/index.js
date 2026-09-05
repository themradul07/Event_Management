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

// Database connection
connectDB();

// Setup Morgan HTTP logger to output via winston logger
const morganStream = {
    write: (message) => logger.info(message.trim())
};
app.use(morgan(':method :url :status :res[content-length] - :response-time ms', { stream: morganStream }));

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

const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
    : [
        "https://eventmanagementdevloop.netlify.app",
        "http://localhost:5173",
        "http://localhost:3000",
        "https://event-management-dusky-zeta.vercel.app"
    ];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(null, true); // Fallback for dev/preview environments
            }
        },
        credentials: true
    })
);

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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
    
    // Start Outbox Polling Event Bus Worker
    const eventBusWorker = require('./workers/eventBusWorker');
    eventBusWorker.startPolling();
});