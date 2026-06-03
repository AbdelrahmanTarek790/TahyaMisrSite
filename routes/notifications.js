const express = require('express');
const {
  sendNotification,
  sendNotificationByRole,
  sendNotificationByGovernorate,
  sendDirectNotification
} = require('../controllers/notificationController');
const { protect,authorize } = require('../middleware/auth');
const { upload } = require('../utils/upload');

const router = express.Router();

router.use(protect); // All routes require authentication
router.use(authorize("admin", "publisher" , "jobs-and-internships"));   // All routes require admin role

router.post('/', sendNotification);
router.post('/role', sendNotificationByRole);
router.post('/governorate', sendNotificationByGovernorate);
router.post('/send', ...upload.single('image'), sendDirectNotification);

module.exports = router;