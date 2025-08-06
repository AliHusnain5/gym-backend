const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: String,
  mobileNo: String,
  address: String,
  membership: String,
  profilePic: String,
   joiningDate: {
    type: Date,
    default: Date.now,
  },
  ExpireDate: Date,
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
}, { timestamps: true }); // createdAt & updatedAt automatically added

module.exports = mongoose.model('Member', memberSchema);
