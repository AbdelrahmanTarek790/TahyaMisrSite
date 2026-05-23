const Media = require('../models/Media');
const {mediaSchema, arabicJoiMessages} = require('../utils/validation');
const path = require('path');
const fs = require('fs');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all media
// @route   GET /api/v1/media
// @access  Public
const getMedia = asyncHandler(async (req, res, next) => {
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
    count: media.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    data: media
  });
});

// @desc    Get single media item
// @route   GET /api/v1/media/:id
// @access  Public
const getMediaById = asyncHandler(async (req, res, next) => {
  const media = await Media.findById(req.params.id).populate('createdBy', 'name email');
  if (!media) {
    return res.status(404).json({
      status: 'error',
      message: 'لم يتم العثور على ملف الوسائط'
    });
  }
  res.status(200).json({
    success: true,
    data: media
  });
});

// @desc    Upload media item
// @route   POST /api/v1/media
// @access  Private/Admin
const uploadMedia = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      status: 'error',
      message: 'برجاء رفع ملف الوسائط'
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
  const populatedMedia = await Media.findById(media._id).populate('createdBy', 'name email');

  res.status(201).json({
    success: true,
    data: populatedMedia
  });
});

// @desc    Update media caption
// @route   PUT /api/v1/media/:id
// @access  Private/Admin
const updateMedia = asyncHandler(async (req, res, next) => {
  const media = await Media.findById(req.params.id);
  if (!media) {
    return res.status(404).json({
      status: 'error',
      message: 'لم يتم العثور على ملف الوسائط'
    });
  }

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
    data: updatedMedia
  });
});

// @desc    Delete media item
// @route   DELETE /api/v1/media/:id
// @access  Private/Admin
const deleteMedia = asyncHandler(async (req, res, next) => {
  const media = await Media.findById(req.params.id);
  if (!media) {
    return res.status(404).json({
      status: 'error',
      message: 'لم يتم العثور على ملف الوسائط'
    });
  }

  const filePath = path.join(process.env.UPLOAD_PATH || './uploads', media.filePath);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  await Media.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'تم حذف ملف الوسائط بنجاح'
  });
});

module.exports = {
  getMedia,
  getMediaById,
  uploadMedia,
  updateMedia,
  deleteMedia
};