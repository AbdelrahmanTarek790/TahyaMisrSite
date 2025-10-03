const express = require('express');
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getEventRegisteredUsers
} = require('../controllers/eventController');
const { protect, admin } = require('../middleware/auth');
const { upload } = require("../utils/upload")

const router = express.Router();

router.get('/', getEvents);
router.get('/:id', getEventById);

// Student registration
router.post('/:id/register', protect, registerForEvent);

// Admin only routes
router.get('/:id/registered-users', protect, admin, getEventRegisteredUsers);
router.post('/', protect, admin, ...upload.news(), createEvent);
router.put('/:id', protect, admin, ...upload.news(), updateEvent);
router.delete('/:id', protect, admin, deleteEvent);

module.exports = router;