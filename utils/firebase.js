const admin = require('firebase-admin');

// Initialize Firebase Admin (only if not already initialized)
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Firebase Admin initialization error:', error.message);
  }
}

// Send push notification
const sendPushNotification = async (tokens, title, message, data = {}) => {
  try {
    if (!tokens || tokens.length === 0) {
      throw new Error('No FCM tokens provided');
    }

    const payload = {
      notification: {
        title,
        body: message,
      },
      data: {
        ...data,
        timestamp: Date.now().toString(),
      },
    };

    const response = await admin.messaging().sendToDevice(tokens, payload);
    
    console.log('Push notification sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Error sending push notification:', error);
    throw error;
  }
};

// Send notification to all users (topic-based)
const sendToTopic = async (topic, title, message, data = {}) => {
  try {
    const payload = {
      notification: {
        title,
        body: message,
      },
      data: {
        ...data,
        timestamp: Date.now().toString(),
      },
    };

    const response = await admin.messaging().sendToTopic(topic, payload);
    
    console.log('Topic notification sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Error sending topic notification:', error);
    throw error;
  }
};

module.exports = {
  sendPushNotification,
  sendToTopic
};