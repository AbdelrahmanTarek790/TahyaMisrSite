const Media = require('../models/Media');
const { mediaSchema } = require('../utils/validation');
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
      success: true,
      data: {
        media,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      },
      error: null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single media
// @route   GET /api/v1/media/:id
// @access  Public
const getMediaById = async (req, res, next) => {
  try {
    const media = await Media.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!media) {
      return res.status(404).json({
        success: false,
        error: 'Media not found',
        data: null
      });
    }

    res.status(200).json({
      success: true,
      data: media,
      error: null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload media
// @route   POST /api/v1/media
// @access  Private/Admin
const uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded',
        data: null
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
    const { error } = mediaSchema.validate(mediaData);
    if (error) {
      // Delete uploaded file if validation fails
      const filePath = path.join(process.env.UPLOAD_PATH || './uploads', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return res.status(400).json({
        success: false,
        error: error.details[0].message,
        data: null
      });
    }

    const media = await Media.create(mediaData);

    const populatedMedia = await Media.findById(media._id)
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      data: populatedMedia,
      error: null
    });
  } catch (error) {
    // Delete uploaded file if error occurs
    if (req.file) {
      const filePath = path.join(process.env.UPLOAD_PATH || './uploads', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    next(error);
  }
};

// @desc    Update media
// @route   PUT /api/v1/media/:id
// @access  Private/Admin
const updateMedia = async (req, res, next) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({
        success: false,
        error: 'Media not found',
        data: null
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
      success: true,
      data: updatedMedia,
      error: null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete media
// @route   DELETE /api/v1/media/:id
// @access  Private/Admin
const deleteMedia = async (req, res, next) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({
        success: false,
        error: 'Media not found',
        data: null
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
      data: { message: 'Media deleted successfully' },
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