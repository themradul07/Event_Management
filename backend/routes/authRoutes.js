const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isLoggedIn, isAdmin } = require('../middleware/auth');

// Authentication endpoints
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/getNavbar', authController.getNavbar);
router.get('/profile', isLoggedIn, authController.getProfile);

// Registration & verification endpoints
router.post('/auth/register', authController.register);
router.post('/auth/verifyemail', authController.verifyEmail);

// User creation endpoint (admin/system-level user creation)
router.post('/auth/create', isLoggedIn, isAdmin, authController.createUser);
router.get('/admin/users', isLoggedIn, isAdmin, authController.getUsers);

module.exports = router;