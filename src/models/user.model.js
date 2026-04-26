const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // 1. Basic Details
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // 2. The Vibe Check (Personalization)
  themePreference: { 
  type: String, 
  default: 'minimalist-dark' 
},
  voiceGuide: { 
    type: String, 
    default: 'anime' 
  },
  mainKryptonite: { type: String }, // e.g., "Doomscrolling", "Adult Content"

  // 3. Gamification & Progression
  auraLevel: { type: Number, default: 1 },
  weeklyPoints: { type: Number, default: 0 }, // Sunday raat ko reset hoga
  allTimePoints: { type: Number, default: 0 },
  cheatMealPasses: { type: Number, default: 0 }, // 5 din strict diet ke baad milega

  // 4. The Time Wallet (Guilt-Free Zone)
  timeWalletBalance: { type: Number, default: 45 }, // Minutes per day

  // 5. The Dream Fund (Savings Tracker)
  dreamProduct: {
    name: { type: String, default: '' },
    targetPrice: { type: Number, default: 0 },
    savedAmount: { type: Number, default: 0 }
  },
  currentStreak: { type: Number, default: 0 },
  lastTaskCompletedAt: { type: Date }, // Track karega aakhiri task kab kiya
  missedYesterday: { type: Boolean, default: false },
  cheatPassesAvailable: { type: Number, default: 0 }, // Default 0 rahega as per logic
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

// Password verify karne ka custom function (Login ke time kaam aayega)
userSchema.methods.matchPassword = async function (enteredPassword) {
  const bcrypt = require('bcryptjs');
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);