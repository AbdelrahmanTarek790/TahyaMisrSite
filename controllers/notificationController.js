const admin = require('firebase-admin');
const User = require('../models/User');
const { sendPushNotification, sendToTopic } = require('../utils/firebase');
const {notificationSchema, arabicJoiMessages} = require('../utils/validation');

// @desc    Send push notification
// @route   POST /api/v1/notifications
// @access  Private/Admin
const sendNotification = async (req, res, next) => {
  try {
    // Validate input
    const { error } = notificationSchema.validate(req.body, { messages: arabicJoiMessages });
    if (error) {
      return res.status(400).json({
            status: 'error',
            message: error.details[0].message
        });
    }

    const { title, message, userIds } = req.body;

    let result;

    if (userIds && userIds.length > 0) {
      // Send to specific users
      const users = await User.find({ _id: { $in: userIds } });

      if (users.length === 0) {
        return res.status(404).json({
            status: 'error',
            message: 'لم يتم العثور على مستخدمين صالحين'
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
            status: 'error',
            message: null
        });
    }

    if (!['student', 'volunteer', 'admin'].includes(role)) {
      return res.status(400).json({
            status: 'error',
            message: 'الدور المحدد غير صالح'
        });
    }

    const users = await User.find({ role });

    if (users.length === 0) {
      return res.status(404).json({
            status: 'error',
            message: `No users found with role: ${role}`
        });
    }

    // In a real implementation, you would use FCM tokens
    console.log(`Sending notification to ${users.length} users with role ${role}:`, {
      title,
      message,
      users: users.map(u => ({ id: u._id, name: u.name, email: u.email }))
    });

    res.status(200).json({
            status: 'error',
            message: null
        });
    }

    const users = await User.find({ governorate });

    if (users.length === 0) {
      return res.status(404).json({
            status: 'error',
            message: `No users found in governorate: ${governorate}`
        });
    }

    // In a real implementation, you would use FCM tokens
    console.log(`Sending notification to ${users.length} users in ${governorate}:`, {
      title,
      message,
      users: users.map(u => ({ id: u._id, name: u.name, email: u.email }))
    });

    res.status(200).json({
            status: 'error',
            message: null
        });
    }

    const message = {
      notification: {
        title: title,
        body: body,
      },
      data: data || {},
      topic: topic
    };

    const response = await admin.messaging().send(message);
    
    console.log('Successfully sent message via direct endpoint:', response);
    res.status(200).json({
      success: true,
      data: {
        messageId: response
      },
      error: null
    });

  } catch (error) {
    console.error('Error sending message:', error);
    next(error);
  }
};

module.exports = {
  sendNotification,
  sendNotificationByRole,
  sendNotificationByGovernorate,
  sendDirectNotification
};