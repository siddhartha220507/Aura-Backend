const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { type: String, required: true }, // e.g., "MERN Stack Coding"
  type: { 
    type: String, 
    enum: ['coding', 'workout', 'diet', 'other'], 
    default: 'other' 
  },
  isCompleted: { type: Boolean, default: false },
  date: { type: Date, default: Date.now } // Taaki daily track ho sake
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);