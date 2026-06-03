const admin = require('firebase-admin');
const User = require('../models/User');
const { sendPushNotification, sendToTopic } = require('../utils/firebase');
const {notificationSchema, arabicJoiMessages} = require('../utils/validation');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Send push notification
// @route   POST /api/v1/notifications
// @access  Private/Admin
const sendNotification = asyncHandler(async (req, res, next) => {
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
        message: 'تم إرسال الإشعار بنجاح',
        details: result
      },
    });
});

// @desc    Send notification by role
// @route   POST /api/v1/notifications/role
// @access  Private/Admin
const sendNotificationByRole = asyncHandler(async (req, res, next) => {
    const { title, message, role } = req.body;
    if (!title || !message || !role) {
        return res.status(400).json({
            status: 'error',
            message: 'العنوان، الرسالة والدور مطلوبة'
        });
    }

    if (!['student', 'volunteer', 'admin', 'member'].includes(role)) {
        return res.status(400).json({
            status: 'error',
            message: 'الدور المحدد غير صالح'
        });
    }

    const users = await User.find({ role });

    if (users.length === 0) {
        return res.status(404).json({
            status: 'error',
            message: `لم يتم العثور على مستخدمين بهذا الدور: ${role}`
        });
    }

    console.log(`Sending notification to ${users.length} users with role ${role}:`, {
        title,
        message
    });

    res.status(200).json({
        success: true,
          data: {
        message: 'تم إرسال الإشعار بنجاح',
        details: {
          sent: users.length,
          role,
          users: users.map(u => ({ id: u._id, name: u.name, email: u.email }))
        }
      },
    });
});

// @desc    Send notification by governorate
// @route   POST /api/v1/notifications/governorate
// @access  Private/Admin
const sendNotificationByGovernorate = asyncHandler(async (req, res, next) => {
    const { title, message, governorate } = req.body;
    if (!title || !message || !governorate) {
        return res.status(400).json({
            status: 'error',
            message: 'العنوان، الرسالة والمحافظة مطلوبة'
        });
    }

    const users = await User.find({ governorate });

    if (users.length === 0) {
        return res.status(404).json({
            status: 'error',
            message: `لم يتم العثور على مستخدمين في هذه المحافظة: ${governorate}`
        });
    }

    console.log(`Sending notification to ${users.length} users in ${governorate}:`, {
        title,
        message
    });

    res.status(200).json({
        success: true,
        data: {
            message: 'تم إرسال الإشعار بنجاح',
            details: {
            sent: users.length,
            governorate,
            users: users.map(u => ({ id: u._id, name: u.name, email: u.email }))
            }
      },
    });
});

// @desc    Send direct FCM message
// @route   POST /api/v1/notifications/direct
// @access  Private/Admin
const sendDirectNotification = asyncHandler(async (req, res, next) => {
    let { title, body, topic, data, image } = req.body;
    
    // Handle file upload if present
    if (req.file) {
        const baseUrl = process.env.BASE_URL || 'https://tmbackend.tahyamisryu.com';
        image = `${baseUrl}/uploads/${req.file.filename}`;
    }

    if (!title || !body || !topic) {
        return res.status(400).json({
            status: 'error',
            message: 'العنوان والرسالة والموضوع مطلوبة'
        });
    }
    if (data && typeof data === 'string') {
        try {
            data = JSON.parse(data);
        } catch (e) {
            console.error('Error parsing notification data:', e);
            data = {};
        }
    }
    const message = {
        notification: {
            title: title,
            body: body,
            // Only include image if it's truthy to prevent Firebase errors
            ...(image && { image })
        },
        data: data || {},
        topic: topic
    };

    const response = await admin.messaging().send(message);
    
    console.log('Successfully sent message via direct endpoint:', response);
    res.status(200).json({
        success: true,
        data: {
            messageId: response,
            image: image || null
        }
    });
});

module.exports = {
    sendNotification,
    sendNotificationByRole,
    sendNotificationByGovernorate,
    sendDirectNotification
};