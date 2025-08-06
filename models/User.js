const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  gymName: String,
  email: { type: String, unique: true },
  userName: String,
  password: String,
  profilePic: String
});

module.exports = mongoose.model("User", userSchema);
