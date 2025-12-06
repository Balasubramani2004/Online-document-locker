// backend/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/authMiddleware'); // Will be created next

// @route POST /api/auth/register
router.post('/register', authController.registerUser);

// @route POST /api/auth/login
router.post('/login', authController.loginUser);

// @route GET /api/auth/me
// We use the 'auth' middleware here to protect this route
router.get('/me', auth, authController.getLoggedInUser); 

module.exports = router;