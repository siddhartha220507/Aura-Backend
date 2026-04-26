const express = require('express');
const router = express.Router();
const { startFocusSession, completeFocusSession, getFocusActivity } = require('../controllers/focusController');
const { protect } = require('../middlewares/auth.middleware');

router.post('/start', protect, startFocusSession);
router.put('/:id/complete', protect, completeFocusSession);
router.get('/activity', protect, getFocusActivity);

module.exports = router;