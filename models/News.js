const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'News title is required'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'News content is required']
  },
  image: {
    type: String,
    default: null
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
newsSchema.index({ createdAt: -1 });
newsSchema.index({ createdBy: 1 });

module.exports = mongoose.model('News', newsSchema);