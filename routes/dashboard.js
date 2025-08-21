const express = require('express');
const router = express.Router();
const User = require('../models/User');
const News = require('../models/News');
const Event = require('../models/Event');
const Media = require('../models/Media');
const auth = require('../middleware/auth');

// @desc    Get dashboard statistics
// @route   GET /api/v1/dashboard/stats
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    // Get counts for various entities
    const [totalUsers, totalNews, totalEvents, totalMedia] = await Promise.all([
      User.countDocuments(),
      News.countDocuments(),
      Event.countDocuments(),
      Media.countDocuments()
    ]);

    // Get active users (users who have logged in within the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: thirtyDaysAgo }
    });

    // Get pending events (future events)
    const pendingEvents = await Event.countDocuments({
      date: { $gt: new Date() },
      status: { $ne: 'cancelled' }
    });

    const stats = {
      totalUsers,
      totalNews,
      totalEvents,
      totalMedia,
      activeUsers,
      pendingEvents
    };

    res.status(200).json({
      success: true,
      data: stats,
      error: null
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: 'Failed to fetch dashboard statistics'
    });
  }
});

// @desc    Get recent activity
// @route   GET /api/v1/dashboard/activity
// @access  Private
router.get('/activity', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get recent activities from different collections
    const [recentNews, recentEvents, recentMedia] = await Promise.all([
      News.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('title content createdAt image')
        .lean(),
      Event.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('title description createdAt image')
        .lean(),
      Media.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('caption description createdAt image')
        .lean()
    ]);

    // Combine and format activities
    const activities = [];

    recentNews.forEach(item => {
      activities.push({
        id: item._id,
        type: 'news',
        title: item.title,
        description: item.content ? item.content.substring(0, 100) + '...' : '',
        timestamp: item.createdAt,
        imageUrl: item.image
      });
    });

    recentEvents.forEach(item => {
      activities.push({
        id: item._id,
        type: 'event',
        title: item.title,
        description: item.description ? item.description.substring(0, 100) + '...' : '',
        timestamp: item.createdAt,
        imageUrl: item.image
      });
    });

    recentMedia.forEach(item => {
      activities.push({
        id: item._id,
        type: 'media',
        title: item.caption || 'Media Upload',
        description: item.description ? item.description.substring(0, 100) + '...' : '',
        timestamp: item.createdAt,
        imageUrl: item.image
      });
    });

    // Sort by timestamp and limit
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const paginatedActivities = activities.slice(skip, skip + limit);

    res.status(200).json({
      success: true,
      data: paginatedActivities,
      error: null
    });
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: 'Failed to fetch recent activity'
    });
  }
});

module.exports = router;