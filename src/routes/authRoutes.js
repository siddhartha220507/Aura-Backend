const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateOnboarding, logoutUser, googleAuth } = require('../controllers/authController');
const { protect } = require('../middlewares/auth.middleware');

// Public routes
router.post('/google', googleAuth);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// Protected route (Middleware used)
router.put('/onboarding', protect, updateOnboarding);

// Protected route to get user details
router.get('/me', protect, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;