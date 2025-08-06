const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  joiningDate: {
    type: Date,
    default: Date.now,
  },
  expireDate: Date,
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
});

module.exports = mongoose.model('Member', memberSchema);
