// routes/otp.js
const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otpController');

// Existing routes
router.post('/send-otp', otpController.sendOtp);
router.post('/verify-otp', otpController.verifyOtp);

// 👇 ADD THIS ROUTE
router.post('/reset-password', otpController.resetPassword);

module.exports = router;
