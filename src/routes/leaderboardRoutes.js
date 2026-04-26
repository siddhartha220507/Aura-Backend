const express = require('express');
const router = express.Router();
const { getLeaderboard } = require('../controllers/leaderboardController');
const { protect } = require('../middlewares/auth.middleware'); // Agar sirf logged in log dekh sakein

router.get('/', protect, getLeaderboard);

module.exports = router;