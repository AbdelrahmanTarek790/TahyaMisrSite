const express = require('express');
const {
  getPositions,
  getPosition,
  createPosition,
  updatePosition,
  deletePosition
} = require('../controllers/positionController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.get('/', getPositions);
router.get('/:id', getPosition);

// Admin only routes
router.post('/', protect, admin, createPosition);
router.put('/:id', protect, admin, updatePosition);
router.delete('/:id', protect, admin, deletePosition);

module.exports = router;