const User = require("../models/User")
const News = require("../models/News")
const Event = require("../models/Event")
const Media = require("../models/Media")
const Timeline = require("../models/Timeline")
const Activity = require("../models/Activity")
const Achievement = require("../models/Achievement")
const Partner = require("../models/Partner")
const Privilege = require("../models/Privilege")
const JoinRequest = require("../models/JoinRequest")

// @desc    Get global dashboard statistics
// @route   GET /api/v1/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res, next) => {
    try {
        const userFilter = {}
        
        // If user is a coordinator, restrict user counts to their governorate
        if (req.user.role === "coordinator") {
            userFilter.governorate = req.user.governorate
        } else if (req.query.governorate && req.query.governorate !== "all") {
            userFilter.governorate = req.query.governorate
        }

        // Aggregate all counts in parallel for performance
        const [
            totalUsers,
            totalNews,
            totalEvents,
            totalMedia,
            totalTimelineEntries,
            totalActivities,
            totalAchievements,
            totalPartners,
            totalPrivileges,
            totalJoinRequests,
            pendingJoinRequests
        ] = await Promise.all([
            User.countDocuments(userFilter),
            News.countDocuments(),
            Event.countDocuments(),
            Media.countDocuments(),
            Timeline.countDocuments(),
            Activity.countDocuments(),
            Achievement.countDocuments(),
            Partner.countDocuments(),
            Privilege.countDocuments(),
            JoinRequest.countDocuments(),
            JoinRequest.countDocuments({ status: "pending" })
        ])

        // Active users: For now, let's define active as users with a membership expiry in the future
        // or simply all users if membership expiry is not set for all.
        // If the client has a specific "status" field later, we can update this.
        const activeUsers = await User.countDocuments({
            ...userFilter,
            $or: [
                { membershipExpiry: { $gt: new Date() } },
                { membershipExpiry: { $exists: false } }
            ]
        })

        // Pending events: Events scheduled for the future
        const pendingEvents = await Event.countDocuments({
            date: { $gt: new Date() }
        })

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalNews,
                totalEvents,
                totalMedia,
                activeUsers,
                pendingEvents,
                totalTimelineEntries,
                totalActivities,
                totalAchievements,
                totalPartners,
                totalPrivileges,
                totalJoinRequests,
                pendingJoinRequests
            },
            error: null
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getDashboardStats
}
