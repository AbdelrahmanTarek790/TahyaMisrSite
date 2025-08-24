const express = require('express');
const {
  getTimeline,
  getTimelineById,
  createTimeline,
  updateTimeline,
  deleteTimeline
} = require('../controllers/timelineController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.get('/', getTimeline);
router.get('/:id', getTimelineById);

// Admin only routes
router.post('/', protect, admin, createTimeline);
router.put('/:id', protect, admin, updateTimeline);
router.delete('/:id', protect, admin, deleteTimeline);

module.exports = router;