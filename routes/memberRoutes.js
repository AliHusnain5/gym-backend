const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const moment = require('moment');
const { searchMember } = require('../controllers/memberController');

// ✅ POST - Add Member
router.post('/add-member', async (req, res) => {
  try {
    const member = new Member(req.body);
    await member.save();
    res.status(201).json(member);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ GET - Paginated Members using skip and limit
router.get('/get-members', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const totalMembers = await Member.countDocuments();
    const members = await Member.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      members,
      totalMembers,
      totalPages: Math.ceil(totalMembers / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET - Search Members
router.get('/search', searchMember);

// ✅ GET - Monthly Joined Members
router.get('/monthly-joined', async (req, res) => {
  const startOfMonth = moment().startOf('month').toDate();
  const endOfMonth = moment().endOf('month').toDate();

  try {
    const members = await Member.find({
      joinDate: { $gte: startOfMonth, $lte: endOfMonth },
    });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET - Expiring Within 3 Days
router.get('/expiring-3-days', async (req, res) => {
  const today = moment();
  const threeDays = moment().add(3, 'days');

  try {
    const members = await Member.find({
      expireDate: { $gte: today.toDate(), $lte: threeDays.toDate() },
      status: 'active',
    });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET - Expiring in 4–7 Days
router.get('/expiring-4-7-days', async (req, res) => {
  const fourDays = moment().add(4, 'days');
  const sevenDays = moment().add(7, 'days');

  try {
    const members = await Member.find({
      expireDate: { $gte: fourDays.toDate(), $lte: sevenDays.toDate() },
      status: 'active',
    });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET - Expired Members
router.get('/expired', async (req, res) => {
  const today = moment();

  try {
    const members = await Member.find({
      expireDate: { $lt: today.toDate() },
      status: 'active',
    });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET - Inactive Members
router.get('/inactive', async (req, res) => {
  try {
    const members = await Member.find({ status: 'inactive' });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// 1️⃣ Get Member by ID
router.get("/:id", async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ error: "Member not found" });
    res.json(member);
  } catch (err) {
    console.error("❌ Error fetching member by ID:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 2️⃣ Update Member Status (Active / Pending Toggle)
router.put("/status/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedMember) return res.status(404).json({ error: "Member not found" });
    res.json({ message: "Status updated", member: updatedMember });
  } catch (err) {
    console.error("❌ Failed to update member status:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 3️⃣ Renew Membership (Update Expire Date)
router.put("/renew/:id", async (req, res) => {
  try {
    const { expireDate } = req.body;

    const updated = await Member.findByIdAndUpdate(
      req.params.id,
      { expireDate },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Member not found" });

    res.json({ message: "Membership renewed", member: updated });
  } catch (err) {
    console.error("❌ Error renewing membership:", err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;


// ✅ GET - Get Single Member by ID
router.get('/:id', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
