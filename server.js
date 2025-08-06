// Correct server.js

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Routes
const authRoutes = require("./routes/authRoutes");
const otpRoutes = require("./routes/otpRoutes");
const memberRoutes = require("./routes/memberRoutes");
const membershipRoutes = require("./routes/membershipRoutes");

// Config
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log("MongoDB connection error:", err));

// Route Middlewares
app.use('/api', authRoutes);
app.use('/api/membership', membershipRoutes);

app.use('/api/otp', otpRoutes);
app.use('/api/member', memberRoutes); // ✅ only this one!
app.use('/api/membership', membershipRoutes);
app.use('/api/members', require('./routes/memberRoutes'));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
