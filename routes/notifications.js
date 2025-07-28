const express = require('express');
const {
  sendNotification,
  sendNotificationByRole,
  sendNotificationByGovernorate
} = require('../controllers/notificationController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All routes require authentication
router.use(admin);   // All routes require admin role

router.post('/', sendNotification);
router.post('/role', sendNotificationByRole);
router.post('/governorate', sendNotificationByGovernorate);

module.exports = router;