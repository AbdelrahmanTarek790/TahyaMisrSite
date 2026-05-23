const Media = require('../models/Media');
const {mediaSchema, arabicJoiMessages} = require('../utils/validation');
const path = require('path');
const fs = require('fs');

// @desc    Get all media
// @route   GET /api/v1/media
// @access  Public
const getMedia = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { type } = req.query;

    let filter = {};
    if (type && ['photo', 'video'].includes(type)) {
      filter.type = type;
    }

    const media = await Media.find(filter)
      .populate('createdBy', 'name email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Media.countDocuments(filter);

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

    // Determine media type based on file mimetype
    const type = req.file.mimetype.startsWith('image/') ? 'photo' : 'video';

    const mediaData = {
      type,
      filePath: req.file.filename,
      caption: req.body.caption || '',
      createdBy: req.user.id
    };

    // Validate input
    const { error } = mediaSchema.validate(mediaData, { messages: arabicJoiMessages });
    if (error) {
      // Delete uploaded file if validation fails
      const filePath = path.join(process.env.UPLOAD_PATH || './uploads', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return res.status(400).json({
            status: 'error',
            message: error.details[0].message
        });
    }

    const media = await Media.create(mediaData);

    const populatedMedia = await Media.findById(media._id)
      .populate('createdBy', 'name email');

    res.status(201).json({
            status: 'error',
            message: null
        });
    }

    // Only allow updating caption
    const updateData = {
      caption: req.body.caption || media.caption
    };

    const updatedMedia = await Media.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).populate('createdBy', 'name email');

    res.status(200).json({
            status: 'error',
            message: null
        });
    }

    // Delete associated file
    const filePath = path.join(process.env.UPLOAD_PATH || './uploads', media.filePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Media.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: { message: 'تم حذف ملف الوسائط بنجاح' },
      error: null
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMedia,
  getMediaById,
  uploadMedia,
  updateMedia,
  deleteMedia
};