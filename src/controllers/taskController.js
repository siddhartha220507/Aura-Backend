const Task = require('../models/Task');
const User = require('../models/user.model');

// @desc    Create a new daily task
// @route   POST /api/tasks
const createTask = async (req, res) => {
  try {
    const { title, type } = req.body;
    const task = await Task.create({
      user: req.user.id,
      title,
      type
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Complete a task and add Points + Cheat Pass Logic
const completeTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.isCompleted) return res.status(400).json({ message: 'Invalid Task' });

    task.isCompleted = true;
    await task.save();

    const user = await User.findById(req.user.id);
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // 🚨 1. STREAK & CHEAT PASS LOGIC
    if (!user.lastTaskCompletedAt || user.lastTaskCompletedAt < startOfToday) {
      user.currentStreak = (user.currentStreak || 0) + 1;

      // Agar streak 5, 10, 15... (multiples of 5) ho jaye, toh 1 Cheat Pass do
      if (user.currentStreak % 5 === 0) {
        user.cheatPassesAvailable = (user.cheatPassesAvailable || 0) + 1;
      }
    }

    user.lastTaskCompletedAt = new Date();
    user.missedYesterday = false;
    user.weeklyPoints += 10;
    user.allTimePoints += 10;
    user.auraLevel = Math.floor(user.allTimePoints / 100) + 1;

    await user.save();

    res.json({ 
      message: user.currentStreak % 5 === 0 ? 'Milestone Reached! Cheat Pass Earned! 🎟️' : 'Task completed!',
      auraLevel: user.auraLevel,
      currentStreak: user.currentStreak,
      cheatPasses: user.cheatPassesAvailable // Frontend ko update bhejo
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
// @desc    Get all tasks for today
// @route   GET /api/tasks
const getMyTasks = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const tasks = await Task.find({ 
      user: req.user.id, 
      createdAt: { $gte: startOfDay } 
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
// @desc    Delete a task
// @route   DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check ki kya ye task usi user ka hai jo delete kar raha hai
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this task' });
    }

    await task.deleteOne();
    res.json({ id: req.params.id, message: 'Task removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { createTask, completeTask, getMyTasks, deleteTask };