const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true }
}, { timestamps: true });

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String, required: true }, 
  caption: { type: String },
  isClean: { type: Boolean, default: true },
  // Hype (Like) karne wale users ki ID store karenge
  hypes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  // Comments array
  comments: [commentSchema]
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);