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
            status: 'error',
            message: null
        });
    }

    res.status(200).json({
            status: 'error',
            message: null
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
            status: 'error',
            message: null
        });
    }

    await timeline.deleteOne();

    res.status(200).json({
      success: true,
      data: { message: 'تم حذف حدث الجدول الزمني بنجاح' },
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