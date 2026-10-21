const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { isLoggedIn, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/multer');

// Public event routes
router.get('/', eventController.getEvents);

// Event routes (publicly viewable, registration requires auth)
router.get('/event/:title', eventController.getEventByTitle);
router.get('/register/part/:event', isLoggedIn, eventController.checkParticipation);
router.post('/register/:title', isLoggedIn, eventController.registerForEvent);

// Event creation route (multipart/form-data upload - requires admin)
router.post('/create/event', isLoggedIn, isAdmin, upload.single("img"), eventController.createEvent);

module.exports = router;
