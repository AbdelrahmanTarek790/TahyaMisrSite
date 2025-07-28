const Position = require('../models/Position');
const { positionSchema } = require('../utils/validation');

// @desc    Get all positions
// @route   GET /api/v1/positions
// @access  Public
const getPositions = async (req, res, next) => {
  try {
    const { governorate } = req.query;
    
    let filter = { isActive: true };
    
    if (governorate) {
      filter = {
        $and: [
          { isActive: true },
          {
            $or: [
              { isGlobal: true },
              { governorate: governorate }
            ]
          }
        ]
      };
    }

    const positions = await Position.find(filter)
      .populate('createdBy', 'name email')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: positions,
      error: null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single position
// @route   GET /api/v1/positions/:id
// @access  Public
const getPosition = async (req, res, next) => {
  try {
    const position = await Position.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!position) {
      return res.status(404).json({
        success: false,
        error: 'Position not found',
        data: null
      });
    }

    res.status(200).json({
      success: true,
      data: position,
      error: null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create position
// @route   POST /api/v1/positions
// @access  Private/Admin
const createPosition = async (req, res, next) => {
  try {
    // Validate input
    const { error } = positionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
        data: null
      });
    }

    // Add createdBy field
    req.body.createdBy = req.user.id;

    // If position is global, remove governorate
    if (req.body.isGlobal) {
      req.body.governorate = null;
    }

    const position = await Position.create(req.body);

    const populatedPosition = await Position.findById(position._id)
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      data: populatedPosition,
      error: null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update position
// @route   PUT /api/v1/positions/:id
// @access  Private/Admin
const updatePosition = async (req, res, next) => {
  try {
    // Validate input
    const { error } = positionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
        data: null
      });
    }

    // If position is global, remove governorate
    if (req.body.isGlobal) {
      req.body.governorate = null;
    }

    const position = await Position.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('createdBy', 'name email');

    if (!position) {
      return res.status(404).json({
        success: false,
        error: 'Position not found',
        data: null
      });
    }

    res.status(200).json({
      success: true,
      data: position,
      error: null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete position (soft delete)
// @route   DELETE /api/v1/positions/:id
// @access  Private/Admin
const deletePosition = async (req, res, next) => {
  try {
    const position = await Position.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!position) {
      return res.status(404).json({
        success: false,
        error: 'Position not found',
        data: null
      });
    }

    res.status(200).json({
      success: true,
      data: { message: 'Position deactivated successfully' },
      error: null
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPositions,
  getPosition,
  createPosition,
  updatePosition,
  deletePosition
};