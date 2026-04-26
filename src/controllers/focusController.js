const FocusSession = require('../models/FocusSession');
const Task = require('../models/Task');
const { focusQueue } = require('../config/queue');

// @desc    Start a new Focus Session
// @route   POST /api/focus/start
const startFocusSession = async (req, res) => {
  try {
    const { taskName, durationSet } = req.body; // durationSet minutes mein aayega

    // 1. Database mein session banao
    const session = await FocusSession.create({
      user: req.user.id,
      taskName,
      durationSet,
      status: 'ACTIVE'
    });

    // ==========================================
    // 🧪 TESTING HACK: 
    // Asli app mein hum (durationSet * 60 * 1000) karenge.
    // Par test karne ke liye hum wait thodi karenge! 
    // Abhi hum isko sirf 30 seconds (30000 ms) ka delay de rahe hain.
    // ==========================================
    const delayInMs = 30 * 1000; // 30 seconds delay for testing

    // 2. Job ko Queue mein daal do with delay
    // await focusQueue.add('checkFocus', { sessionId: session._id }, { delay: delayInMs });

    res.status(201).json({
      message: `Focus session started for ${durationSet} minutes. Put your phone away!`,
      session
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Complete Focus Session manually before time is up
// @route   PUT /api/focus/:id/complete
const completeFocusSession = async (req, res) => {
  try {
    const session = await FocusSession.findById(req.params.id);
    
    if (!session) return res.status(404).json({ message: 'Session not found' });
    
    session.status = 'COMPLETED';
    await session.save();

    res.json({ message: 'Focus Session Completed successfully! Aura protected.' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get aggregated activity (Focus Sessions + Completed Tasks)
// @route   GET /api/focus/activity
const getFocusActivity = async (req, res) => {
  try {
    // 1. Saare completed focus sessions le aao
    const sessions = await FocusSession.find({
      user: req.user.id,
      status: 'COMPLETED'
    });

    // 2. Saare completed tasks bhi le aao
    const tasks = await Task.find({
      user: req.user.id,
      isCompleted: true
    });

    // Dono ko bhej do
    res.json({ sessions, tasks });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { startFocusSession, completeFocusSession, getFocusActivity };