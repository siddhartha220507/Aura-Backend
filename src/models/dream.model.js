const mongoose = require('mongoose');

const dreamSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  targetAmount: { 
    type: Number, 
    required: true // Goal kitne points/rupees ka hai
  },
  currentAmount: { 
    type: Number, 
    default: 0    // Abhi kitna jama kar liya hai
  },
  status: { 
    type: String, 
    enum: ['ACTIVE', 'ACHIEVED'], 
    default: 'ACTIVE' 
  },
  icon: { 
    type: String, 
    default: 'Target' // Frontend pe alag-alag icons dikhane ke liye
  }
}, { timestamps: true });

module.exports = mongoose.model('Dream', dreamSchema);