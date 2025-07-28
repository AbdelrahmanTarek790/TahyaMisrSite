const express = require('express');
const {
  getMedia,
  getMediaById,
  uploadMedia,
  updateMedia,
  deleteMedia
} = require('../controllers/mediaController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../utils/upload');

const router = express.Router();

router.get('/', getMedia);
router.get('/:id', getMediaById);

// Admin only routes
router.post('/', protect, admin, upload.single('file'), uploadMedia);
router.put('/:id', protect, admin, updateMedia);
router.delete('/:id', protect, admin, deleteMedia);

module.exports = router;