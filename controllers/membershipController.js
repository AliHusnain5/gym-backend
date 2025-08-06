const Membership = require('../models/Membership');

exports.addMembership = async (req, res) => {
  const { months, price } = req.body;

  try {
    // check if this membership already exists
    const exists = await Membership.findOne({ months });

    if (exists) {
      exists.price = price; // update price
      await exists.save();
      return res.status(200).json({ message: 'Membership updated successfully' });
    }

    const newMembership = new Membership({ months, price });
    await newMembership.save();

    res.status(200).json({ message: 'Membership added successfully', membership: newMembership });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add membership' });
  }
};

exports.getAllMemberships = async (req, res) => {
  try {
    const memberships = await Membership.find();
    res.status(200).json(memberships);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch memberships' });
  }
};
