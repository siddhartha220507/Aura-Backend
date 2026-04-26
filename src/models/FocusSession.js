const mongoose = require('mongoose');

const focusSessionSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Status is very important for the Escalation Protocol
  status: { 
    type: String, 
    enum: [
      'ACTIVE',            // User abhi focus kar raha hai
      'PENDING_WARNING',   // Time wallet khatam, warning SMS jane wala hai
      'ESCALATED_CALL',    // SMS ignore kiya, Call chali gayi
      'COMPLETED',         // Voice assistant ne bola "Task Done"
      'FAILED'             // User ne give up kar diya
    ], 
    default: 'ACTIVE' 
  },
  
  taskName: { type: String, required: true }, // e.g., "MERN Stack Project", "Workout"
  durationSet: { type: Number, required: true }, // Kitne minute ka goal tha
  
  // Agar beech mein phone uthaya toh track karne ke liye
  distractionsCount: { type: Number, default: 0 } 
}, { timestamps: true });

module.exports = mongoose.model('FocusSession', focusSessionSchema);