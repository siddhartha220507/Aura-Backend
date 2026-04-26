const express = require('express');
const router = express.Router();
const { getDreams, addDream, fundDream, deleteDream } = require('../controllers/dreamController');
const { protect } = require('../middlewares/auth.middleware');

router.route('/')
  .get(protect, getDreams)
  .post(protect, addDream);

router.put('/:id/fund', protect, fundDream);
router.delete('/:id', protect, deleteDream);

module.exports = router;