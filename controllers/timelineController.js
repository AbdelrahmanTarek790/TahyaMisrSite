const Timeline = require('../models/Timeline');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all timeline events
// @route   GET /api/v1/timeline
// @access  Public
const getTimeline = asyncHandler(async (req, res, next) => {
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
      }
  });
});

// @desc    Get single timeline event
// @route   GET /api/v1/timeline/:id
// @access  Public
const getTimelineById = asyncHandler(async (req, res, next) => {
  const timeline = await Timeline.findById(req.params.id);

  if (!timeline) {
    return res.status(404).json({
      status: 'error',
      message: 'لم يتم العثور على حدث الجدول الزمني'
    });
  }

  res.status(200).json({
    success: true,
    data: { timeline }
  });
});

// @desc    Create timeline event
// @route   POST /api/v1/timeline
// @access  Private/Admin
const createTimeline = asyncHandler(async (req, res, next) => {
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
    data: { timeline }
  });
});

// @desc    Update timeline event
// @route   PUT /api/v1/timeline/:id
// @access  Private/Admin
const updateTimeline = asyncHandler(async (req, res, next) => {
  let timeline = await Timeline.findById(req.params.id);

  if (!timeline) {
    return res.status(404).json({
      status: 'error',
      message: 'لم يتم العثور على حدث الجدول الزمني'
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
    data: { timeline }
  });
});

// @desc    Delete timeline event
// @route   DELETE /api/v1/timeline/:id
// @access  Private/Admin
const deleteTimeline = asyncHandler(async (req, res, next) => {
  const timeline = await Timeline.findById(req.params.id);

  if (!timeline) {
    return res.status(404).json({
      status: 'error',
      message: 'لم يتم العثور على حدث الجدول الزمني'
    });
  }

  await timeline.deleteOne();

  res.status(200).json({
    success: true,
    message: 'تم حذف حدث الجدول الزمني بنجاح'
  });
});

module.exports = {
  getTimeline,
  getTimelineById,
  createTimeline,
  updateTimeline,
  deleteTimeline
};