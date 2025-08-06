const express = require('express');
const router = express.Router();
const { addMembership, getAllMemberships } = require('../controllers/membershipController');

router.post('/add', addMembership);
router.get('/all', getAllMemberships);

module.exports = router;
