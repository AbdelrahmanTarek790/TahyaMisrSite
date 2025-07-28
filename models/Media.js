const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['photo', 'video'],
    required: [true, 'Media type is required']
  },
  filePath: {
    type: String,
    required: [true, 'File path is required']
  },
  caption: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for performance
mediaSchema.index({ type: 1 });
mediaSchema.index({ createdAt: -1 });
mediaSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Media', mediaSchema);