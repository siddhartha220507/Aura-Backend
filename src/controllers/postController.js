const Post = require('../models/post.model');
const User = require('../models/user.model');

const createPost = async (req, res) => {
  try {
    const top10Users = await User.find({}).sort({ weeklyPoints: -1 }).limit(10).select('_id');
    const isTop10 = top10Users.some((topUser) => topUser._id.toString() === req.user.id);

    if (!isTop10) {
      return res.status(403).json({ message: "Locked! 🔒 Only the Top 10 users can post in the Arena." });
    }
    if (!req.file) return res.status(400).json({ message: 'Please upload an image' });

    const post = await Post.create({
      user: req.user.id,
      imageUrl: req.file.path,
      caption: req.body.caption
    });

    const user = await User.findById(req.user.id);
    user.allTimePoints += 5; 
    await user.save();

    res.status(201).json({ message: 'Post shared in the Arena! +5 Aura Points', post });
  } catch (error) { res.status(500).json({ message: 'Server Error', error: error.message }); }
};

const getArenaPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name auraLevel')
      .populate('comments.user', 'name auraLevel') // Comments ke users bhi laao
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(posts);
  } catch (error) { res.status(500).json({ message: 'Server Error', error: error.message }); }
};

// --- NAYE FUNCTIONS ---

// 1. Delete Post
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.user.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    
    await post.deleteOne();
    res.json({ message: 'Post deleted from Arena' });
  } catch (error) { res.status(500).json({ message: 'Server Error', error: error.message }); }
};

// 2. Toggle Hype (Like)
const toggleHype = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const index = post.hypes.indexOf(req.user.id);
    if (index === -1) post.hypes.push(req.user.id); // Add hype
    else post.hypes.splice(index, 1); // Remove hype

    await post.save();
    res.json({ hypes: post.hypes });
  } catch (error) { res.status(500).json({ message: 'Server Error', error: error.message }); }
};

// 3. Add Comment
const addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({ user: req.user.id, text: req.body.text });
    await post.save();
    
    // Naya data wapas bhejo
    const updatedPost = await Post.findById(req.params.id)
      .populate('user', 'name auraLevel')
      .populate('comments.user', 'name auraLevel');
    
    res.json(updatedPost);
  } catch (error) { res.status(500).json({ message: 'Server Error', error: error.message }); }
};

// @desc    Get Global Arena Statistics
// @route   GET /api/posts/stats
const getArenaStats = async (req, res) => {
  try {
    // 1. Total active agents (users)
    const totalAgents = await User.countDocuments();
    
    // 2. Total proofs (posts)
    const totalPosts = await Post.countDocuments();
    
    // 3. Total Hype (saari posts ke hypes array ka sum)
    const allPosts = await Post.find().select('hypes');
    const totalHype = allPosts.reduce((acc, post) => acc + (post.hypes ? post.hypes.length : 0), 0);

    res.json({
      activeAgents: totalAgents,
      totalHype: totalHype,
      proofsUploaded: totalPosts
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { createPost, getArenaPosts, deletePost, toggleHype, addComment, getArenaStats };