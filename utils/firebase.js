const admin = require("firebase-admin")

// Initialize Firebase Admin (only if not already initialized)
if (!admin.apps.length) {
    try {
        const serviceAccount = require("../config/serviceAccountKey.json")
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        })
        console.log("Firebase Admin initialized successfully using serviceAccountKey.json")
    } catch (error) {
        console.error("Firebase Admin initialization error:", error.message)
        console.error("Please make sure you have placed your serviceAccountKey.json file in the config folder.")
    }
}

// Send push notification
const sendPushNotification = async (tokens, title, message, data = {}) => {
    try {
        if (!tokens || tokens.length === 0) {
            throw new Error("No FCM tokens provided")
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
        }

        const response = await admin.messaging().sendToDevice(tokens, payload)

        console.log("Push notification sent successfully:", response)
        return response
    } catch (error) {
        console.error("Error sending push notification:", error)
        throw error
    }
}

// Send notification to all users (topic-based)
const sendToTopic = async (topic, title, message, data = {}, image) => {
    try {
        const fcmMessage = {
            topic,
            notification: {
                title,
                body: message,
            },
            data: {
                ...data,
                timestamp: Date.now().toString(),
            },
        }

        // Attach image with platform-specific keys so it shows on Android, iOS, and Web
        if (image) {
            // Android: notification image
            fcmMessage.android = {
                notification: {
                    imageUrl: image,
                },
            }
            // iOS: requires mutable-content + fcm_options for the image
            fcmMessage.apns = {
                payload: {
                    aps: {
                        "mutable-content": 1,
                    },
                },
                fcm_options: {
                    image,
                },
            }
            // Web Push: image in headers
            fcmMessage.webpush = {
                headers: {
                    image,
                },
            }
        }

        const response = await admin.messaging().send(fcmMessage)

        console.log("Topic notification sent successfully:", response)
        return response
    } catch (error) {
        console.error("Error sending topic notification:", error)
        throw error
    }
}

module.exports = {
    sendPushNotification,
    sendToTopic,
}
