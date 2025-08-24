const Timeline = require('../models/Timeline');

// @desc    Get all timeline events
// @route   GET /api/v1/timeline
// @access  Public
const getTimeline = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const timeline = await Timeline.find()
      .sort({ order: 1, year: 1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Timeline.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        timeline,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      },
      error: null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single timeline event
// @route   GET /api/v1/timeline/:id
// @access  Public
const getTimelineById = async (req, res, next) => {
  try {
    const timeline = await Timeline.findById(req.params.id);

    if (!timeline) {
      return res.status(404).json({
        success: false,
        error: 'Timeline event not found',
        data: null
      });
    }

    res.status(200).json({
      success: true,
      data: { timeline },
      error: null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create timeline event
// @route   POST /api/v1/timeline
// @access  Private/Admin
const createTimeline = async (req, res, next) => {
  try {
    const { year, title, description, achievement, order } = req.body;

    const timeline = await Timeline.create({
      year,
      title,
      description,
      achievement,
      order: order || 0
    });

    res.status(201).json({
      success: true,
      data: { timeline },
      error: null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update timeline event
// @route   PUT /api/v1/timeline/:id
// @access  Private/Admin
const updateTimeline = async (req, res, next) => {
  try {
    let timeline = await Timeline.findById(req.params.id);

    if (!timeline) {
      return res.status(404).json({
        success: false,
        error: 'Timeline event not found',
        data: null
      });
    }

    timeline = await Timeline.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: { timeline },
      error: null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete timeline event
// @route   DELETE /api/v1/timeline/:id
// @access  Private/Admin
const deleteTimeline = async (req, res, next) => {
  try {
    const timeline = await Timeline.findById(req.params.id);

    if (!timeline) {
      return res.status(404).json({
        success: false,
        error: 'Timeline event not found',
        data: null
      });
    }

    await timeline.deleteOne();

    res.status(200).json({
      success: true,
      data: { message: 'Timeline event deleted successfully' },
      error: null
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTimeline,
  getTimelineById,
  createTimeline,
  updateTimeline,
  deleteTimeline
};