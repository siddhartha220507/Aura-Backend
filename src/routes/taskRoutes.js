const express = require('express');
const router = express.Router();
const { createTask, completeTask, getMyTasks, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middlewares/auth.middleware');

router.route('/')
  .post(protect, createTask)
  .get(protect, getMyTasks);

router.put('/:id/complete', protect, completeTask);

router.delete('/:id', protect, deleteTask);

module.exports = router;