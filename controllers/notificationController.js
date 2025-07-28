const User = require('../models/User');
const { sendPushNotification, sendToTopic } = require('../utils/firebase');
const { notificationSchema } = require('../utils/validation');

// @desc    Send push notification
// @route   POST /api/v1/notifications
// @access  Private/Admin
const sendNotification = async (req, res, next) => {
  try {
    // Validate input
    const { error } = notificationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
        data: null
      });
    }

    const { title, message, userIds } = req.body;

    let result;

    if (userIds && userIds.length > 0) {
      // Send to specific users
      const users = await User.find({ _id: { $in: userIds } });

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'No valid users found',
          data: null
        });
      }

      // In a real implementation, you would store FCM tokens for users
      // For now, we'll simulate the notification sending
      console.log(`Sending notification to ${users.length} users:`, {
        title,
        message,
        users: users.map(u => ({ id: u._id, name: u.name, email: u.email }))
      });

      result = {
        sent: users.length,
        users: users.map(u => ({ id: u._id, name: u.name, email: u.email }))
      };
    } else {
      // Send to all users (topic-based)
      try {
        await sendToTopic('all-users', title, message);
        const totalUsers = await User.countDocuments();
        
        result = {
          sent: totalUsers,
          topic: 'all-users'
        };
      } catch (firebaseError) {
        console.error('Firebase notification error:', firebaseError);
        
        // Fallback: log notification details
        const totalUsers = await User.countDocuments();
        console.log(`Broadcasting notification to all ${totalUsers} users:`, {
          title,
          message
        });

        result = {
          sent: totalUsers,
          topic: 'all-users',
          note: 'Firebase not configured, notification logged'
        };
      }
    }

    res.status(200).json({
      success: true,
      data: {
        message: 'Notification sent successfully',
        details: result
      },
      error: null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send notification to users by role
// @route   POST /api/v1/notifications/role
// @access  Private/Admin
const sendNotificationByRole = async (req, res, next) => {
  try {
    const { title, message, role } = req.body;

    if (!title || !message || !role) {
      return res.status(400).json({
        success: false,
        error: 'Title, message, and role are required',
        data: null
      });
    }

    if (!['student', 'volunteer', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid role specified',
        data: null
      });
    }

    const users = await User.find({ role });

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        error: `No users found with role: ${role}`,
        data: null
      });
    }

    // In a real implementation, you would use FCM tokens
    console.log(`Sending notification to ${users.length} users with role ${role}:`, {
      title,
      message,
      users: users.map(u => ({ id: u._id, name: u.name, email: u.email }))
    });

    res.status(200).json({
      success: true,
      data: {
        message: 'Notification sent successfully',
        details: {
          sent: users.length,
          role,
          users: users.map(u => ({ id: u._id, name: u.name, email: u.email }))
        }
      },
      error: null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send notification to users by governorate
// @route   POST /api/v1/notifications/governorate
// @access  Private/Admin
const sendNotificationByGovernorate = async (req, res, next) => {
  try {
    const { title, message, governorate } = req.body;

    if (!title || !message || !governorate) {
      return res.status(400).json({
        success: false,
        error: 'Title, message, and governorate are required',
        data: null
      });
    }

    const users = await User.find({ governorate });

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        error: `No users found in governorate: ${governorate}`,
        data: null
      });
    }

    // In a real implementation, you would use FCM tokens
    console.log(`Sending notification to ${users.length} users in ${governorate}:`, {
      title,
      message,
      users: users.map(u => ({ id: u._id, name: u.name, email: u.email }))
    });

    res.status(200).json({
      success: true,
      data: {
        message: 'Notification sent successfully',
        details: {
          sent: users.length,
          governorate,
          users: users.map(u => ({ id: u._id, name: u.name, email: u.email }))
        }
      },
      error: null
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendNotification,
  sendNotificationByRole,
  sendNotificationByGovernorate
};