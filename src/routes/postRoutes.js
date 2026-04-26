const express = require('express');
const router = express.Router();
const { createPost, getArenaPosts, deletePost, toggleHype, addComment, getArenaStats } = require('../controllers/postController');
const { protect } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/uploadMiddleware'); 

router.post('/', protect, upload.single('image'), createPost);
router.get('/', protect, getArenaPosts);

router.get('/stats', protect, getArenaStats);

// Naye Routes
router.delete('/:id', protect, deletePost);
router.put('/:id/hype', protect, toggleHype);
router.post('/:id/comment', protect, addComment);

module.exports = router;