const User = require('../models/user.model');

// @desc    Get Top 10 Users for Leaderboard
// @route   GET /api/leaderboard
// @access  Public or Private (Tumhari marzi, abhi private rakhte hain)
const getLeaderboard = async (req, res) => {
  try {
    const { type } = req.query; // URL mein ?type=weekly ya ?type=allTime aayega

    let sortOption = {};
    if (type === 'allTime') {
      sortOption = { allTimePoints: -1 }; // -1 ka matlab descending (Highest to Lowest)
    } else {
      // Default to weekly
      sortOption = { weeklyPoints: -1 };
    }

    // Top 10 users laao (password aur email hide kardo security ke liye)
    const topUsers = await User.find({})
      .sort(sortOption)
      .limit(10)
      .select('name auraLevel weeklyPoints allTimePoints themePreference');

    res.status(200).json(topUsers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { getLeaderboard };