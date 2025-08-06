const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Register
exports.register = async (req, res) => {
  try {
    const { gymName, email, userName, password, profilePic } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      gymName, email, userName, password: hashedPassword, profilePic
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
};

// Login
exports.login = async (req, res) => {
  const { userName, password } = req.body;

  try {
    const user = await User.findOne({ userName });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
};
