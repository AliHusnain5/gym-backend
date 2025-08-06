const Member = require('../models/Member');

exports.addMember = async (req, res) => {
  const { name, mobileNo, address, membership, profilePic, joiningDate } = req.body;

  try {
    const newMember = new Member({ name, mobileNo, address, membership, profilePic, joiningDate });
    await newMember.save();
    res.status(200).json({ message: 'Member added successfully', member: newMember });
  } catch (error) {
    console.error('Error adding member:', error);
    res.status(500).json({ error: 'Failed to add member' });
  }
};
// Search members by name or mobile number
exports.searchMember = async (req, res) => {
  const term = req.query.term;

  try {
    const members = await Member.find({
      $or: [
        { name: { $regex: term, $options: "i" } },
        { mobileNo: { $regex: term, $options: "i" } }
      ]
    });

    res.json(members);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Search failed", error });
  }
};
