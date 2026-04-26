const User = require('../models/user.model');

// @desc    Update user profile (Name & Theme)
// @route   PUT /api/users/profile
// @desc    Update user profile (Name & Theme)
// @desc    Update user profile 
const updateProfile = async (req, res) => {
  try {
    const { name, themePreference, voiceGuide } = req.body; 
    const user = await User.findById(req.user.id);
    
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Jo bhi req.body mein aayega, wo save ho jayega
    if (name) user.name = name;
    if (themePreference) user.themePreference = themePreference;
    if (voiceGuide) user.voiceGuide = voiceGuide; 
    
    // Numbers & Booleans ke liye hum undefined check karte hain
    if (req.body.missedYesterday !== undefined) user.missedYesterday = req.body.missedYesterday;
    if (req.body.timeWalletBalance !== undefined) user.timeWalletBalance = req.body.timeWalletBalance;
    if (req.body.cheatPassesAvailable !== undefined) user.cheatPassesAvailable = req.body.cheatPassesAvailable;
    
    await user.save();
    res.json(user);
    
  } catch (error) {
    console.error("Profile Update Error:", error); // 🚨 Ye backend terminal mein error print karega
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { updateProfile };