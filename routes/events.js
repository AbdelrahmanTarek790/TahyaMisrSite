const express = require('express');
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent
} = require('../controllers/eventController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../utils/upload');

const router = express.Router();

router.get('/', getEvents);
router.get('/:id', getEventById);

// Student registration
router.post('/:id/register', protect, registerForEvent);

// Admin only routes
router.post('/', protect, admin, upload.single('image'), createEvent);
router.put('/:id', protect, admin, upload.single('image'), updateEvent);
router.delete('/:id', protect, admin, deleteEvent);

module.exports = router;