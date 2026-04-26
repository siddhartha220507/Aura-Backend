const Dream = require('../models/dream.model');

// @desc    Get user's dreams/goals
// @route   GET /api/dreams
const getDreams = async (req, res) => {
  try {
    const dreams = await Dream.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(dreams);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a new dream goal
// @route   POST /api/dreams
const addDream = async (req, res) => {
  try {
    const { title, targetAmount, icon } = req.body;
    
    if (!title || !targetAmount) {
      return res.status(400).json({ message: 'Title and Target Amount are required' });
    }

    const dream = await Dream.create({
      user: req.user.id,
      title,
      targetAmount,
      icon: icon || 'Target'
    });

    res.status(201).json(dream);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Fund/Deposit points into a dream
// @route   PUT /api/dreams/:id/fund
const fundDream = async (req, res) => {
  try {
    const { amount } = req.body;
    const dream = await Dream.findById(req.params.id);
    
    if (!dream) return res.status(404).json({ message: 'Dream not found' });
    if (dream.user.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    dream.currentAmount += Number(amount);
    
    // Agar goal pura ho gaya toh status update kar do
    if (dream.currentAmount >= dream.targetAmount) {
      dream.currentAmount = dream.targetAmount; // Cap at max
      dream.status = 'ACHIEVED';
    }
    
    await dream.save();
    res.json(dream);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a dream
// @route   DELETE /api/dreams/:id
const deleteDream = async (req, res) => {
  try {
    const dream = await Dream.findById(req.params.id);
    if (!dream) return res.status(404).json({ message: 'Dream not found' });
    if (dream.user.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    
    await dream.deleteOne();
    res.json({ id: req.params.id, message: 'Dream obliterated' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { getDreams, addDream, fundDream, deleteDream };