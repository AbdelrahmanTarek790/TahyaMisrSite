const mongoose = require('mongoose');

const timelineSchema = new mongoose.Schema({
  year: {
    type: String,
    required: [true, 'Timeline year is required'],
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Timeline title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Timeline description is required']
  },
  achievement: {
    type: String,
    required: [true, 'Timeline achievement is required']
  },
  order: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
});

// Index for performance and ordering
timelineSchema.index({ order: 1 });
timelineSchema.index({ year: 1 });
timelineSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Timeline', timelineSchema);