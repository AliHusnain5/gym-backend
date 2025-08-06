const Otp = require('../models/Otp');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();


const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL,         // your email
    pass: process.env.EMAIL_PASS     // your email password or app password
  }
});

exports.sendOtp = async (req, res) => {
  const { email } = req.body;
   console.log("Send OTP route hit with email:", email);
  const otp = crypto.randomInt(100000, 999999).toString();

  try {
    // Remove old OTPs
    await Otp.deleteMany({ email });

    // Save new OTP
    await Otp.create({ email, otp });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}. It will expire in 5 minutes.`
    });

    res.status(200).json({ message: 'OTP sent successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'OTP sending failed' });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const record = await Otp.findOne({ email, otp });

    if (!record) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    await Otp.deleteMany({ email }); // Clean up

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'OTP verification failed' });
  }
};




// resetpassword

const User = require('../models/User');  // Make sure the path is correct
const bcrypt = require('bcrypt');

// RESET PASSWORD CONTROLLER
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ error: 'Email and new password required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
