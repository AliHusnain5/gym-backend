const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  months: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Membership', membershipSchema);
