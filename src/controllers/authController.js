const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

// 🚨 Yahan apna Google Client ID daalna (Ya .env se lena)
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// JWT Token Generator
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Authenticate with Google (Handles BOTH Login & Register)
// @route   POST /api/auth/google
const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    // 1. Verify Google Token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    // 2. Extract User Info from Google
    const { email, name, picture } = ticket.getPayload();

    // 3. Check if user already exists in our database
    let user = await User.findOne({ email });

    if (!user) {
      // 4. REGISTER: Agar account nahi hai, toh turant naya bana do
      const randomPassword = Math.random().toString(36).slice(-10) + "AuraSecure!";
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      user = await User.create({
        name,
        email,
        password: hashedPassword,
        // Tum chaho toh picture bhi save kar sakte ho agar model me field hai toh
      });
    }

    // 5. LOGIN: JWT Token banao aur response bhejo (Same as normal login)
    res.status(200).json({
      token: generateToken(user._id),
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
        themePreference: user.themePreference,
        auraLevel: user.auraLevel,
        mainKryptonite: user.mainKryptonite,
        role: user.role // 🚨 Admin panel ke liye role bhejna zaroori hai
      }
    });

  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(401).json({ message: 'Invalid Google Token', error: error.message });
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please add all fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        message: 'User registered successfully',
        token: generateToken(user._id),
        user: {
          _id: user.id,
          name: user.name,
          email: user.email,
        }
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        token: generateToken(user._id),
        user: {
          _id: user.id,
          name: user.name,
          email: user.email,
          themePreference: user.themePreference,
          auraLevel: user.auraLevel,
          mainKryptonite: user.mainKryptonite,
          role: user.role // 🚨 Make sure Admin role is passed here too
        }
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Set User Vibe (Onboarding)
// @route   PUT /api/auth/onboarding
const updateOnboarding = async (req, res) => {
  try {
    const { themePreference, voiceGuide, mainKryptonite, dreamProduct } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.themePreference = themePreference || user.themePreference;
    user.voiceGuide = voiceGuide || user.voiceGuide;
    user.mainKryptonite = mainKryptonite || user.mainKryptonite;
    
    if (dreamProduct) {
      user.dreamProduct = {
        name: dreamProduct.name,
        targetPrice: dreamProduct.targetPrice,
        savedAmount: 0
      };
    }

    const updatedUser = await user.save();
    res.json({ message: 'Onboarding complete', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const logoutUser = (req, res) => {
  res.status(200).json({ message: 'User logged out successfully. Aura disconnected.' });
};

// 🚨 Export mein googleAuth add karna mat bhoolna
module.exports = { registerUser, loginUser, updateOnboarding, logoutUser, googleAuth };