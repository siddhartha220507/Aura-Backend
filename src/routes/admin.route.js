const express = require('express');
const router = express.Router();
// Dhyan rakhna ki tumhara User model ka path sahi ho
const User = require('../models/user.model'); 

// 🟢 1. GET ALL USERS (Admin panel ko list dene ke liye)
router.get('/users', async (req, res) => {
  try {
    // .select('-password') se hum user ka password frontend pe nahi bhejenge (Security!)
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error("Admin Fetch Users Error:", error);
    res.status(500).json({ message: "Server error fetching users" });
  }
});

// 🔴 2. DELETE USER (Agent ko banish karne ke liye)
router.delete('/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User completely obliterated from Aura" });
  } catch (error) {
    console.error("Admin Delete User Error:", error);
    res.status(500).json({ message: "Server error deleting user" });
  }
});

module.exports = router;