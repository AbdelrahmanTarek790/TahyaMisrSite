const Activity = require("../models/Activity")

// @desc    Get all activities
// @route   GET /api/activities
// @access  Public
exports.getActivities = async (req, res) => {
    try {
        const { isActive } = req.query
        const filter = isActive !== undefined ? { isActive: isActive === "true" } : {}

        const activities = await Activity.find(filter).sort({ order: 1, createdAt: -1 }).populate("createdBy", "name email")

        res.status(200).json({
            success: true,
            count: activities.length,
            data: activities,
        })
    } catch (error) {
        console.error("Get activities error:", error)
        res.status(500).json({
            success: false,
            message: "Failed to fetch activities",
            error: error.message,
        })
    }
}

// @desc    Get single activity by ID
// @route   GET /api/activities/:id
// @access  Public
exports.getActivityById = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id).populate("createdBy", "name email")

        if (!activity) {
            return res.status(404).json({
                success: false,
                message: "Activity not found",
            })
        }

        res.status(200).json({
            success: true,
            data: activity,
        })
    } catch (error) {
        console.error("Get activity by ID error:", error)
        res.status(500).json({
            success: false,
            message: "Failed to fetch activity",
            error: error.message,
        })
    }
}

// @desc    Create new activity
// @route   POST /api/activities
// @access  Private (Admin only)
exports.createActivity = async (req, res) => {
    try {
        const { title, color, order, isActive } = req.body

        // Validate required fields
        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Title is required",
            })
        }

        // Handle image upload
        let imagePath = null
        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`
        } else if (req.body.image && typeof req.body.image === "string" && req.body.image.trim() !== "") {
            imagePath = req.body.image
        }

        const activity = await Activity.create({
            title,
            image: imagePath,
            color: color || "bg-gradient-to-br from-egypt-red to-egypt-gold",
            order: order || 0,
            isActive: isActive !== undefined ? isActive : true,
            createdBy: req.user._id,
        })

        res.status(201).json({
            success: true,
            message: "Activity created successfully",
            data: activity,
        })
    } catch (error) {
        console.error("Create activity error:", error)
        res.status(500).json({
            success: false,
            message: "Failed to create activity",
            error: error.message,
        })
    }
}

// @desc    Update activity
// @route   PUT /api/activities/:id
// @access  Private (Admin only)
exports.updateActivity = async (req, res) => {
    try {
        const { title, color, order, isActive } = req.body

        let activity = await Activity.findById(req.params.id)

        if (!activity) {
            return res.status(404).json({
                success: false,
                message: "Activity not found",
            })
        }

        // Handle image upload
        if (req.file) {
            activity.image = `/uploads/${req.file.filename}`
        } else if (req.body.image !== undefined) {
            // Only update if it's a valid string
            if (typeof req.body.image === "string" && req.body.image.trim() !== "") {
                activity.image = req.body.image
            } else if (req.body.image === "" || req.body.image === null) {
                // Explicitly set to null if empty string or null
                activity.image = null
            }
        }

        // Update fields
        if (title !== undefined) activity.title = title
        if (color !== undefined) activity.color = color
        if (order !== undefined) activity.order = order
        if (isActive !== undefined) activity.isActive = isActive

        await activity.save()

        res.status(200).json({
            success: true,
            message: "Activity updated successfully",
            data: activity,
        })
    } catch (error) {
        console.error("Update activity error:", error)
        res.status(500).json({
            success: false,
            message: "Failed to update activity",
            error: error.message,
        })
    }
}

// @desc    Delete activity
// @route   DELETE /api/activities/:id
// @access  Private (Admin only)
exports.deleteActivity = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id)

        if (!activity) {
            return res.status(404).json({
                success: false,
                message: "Activity not found",
            })
        }

        await activity.deleteOne()

        res.status(200).json({
            success: true,
            message: "Activity deleted successfully",
            data: {},
        })
    } catch (error) {
        console.error("Delete activity error:", error)
        res.status(500).json({
            success: false,
            message: "Failed to delete activity",
            error: error.message,
        })
    }
}

// @desc    Toggle activity active status
// @route   PATCH /api/activities/:id/toggle
// @access  Private (Admin only)
exports.toggleActivityStatus = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id)

        if (!activity) {
            return res.status(404).json({
                success: false,
                message: "Activity not found",
            })
        }

        activity.isActive = !activity.isActive
        await activity.save()

        res.status(200).json({
            success: true,
            message: `Activity ${activity.isActive ? "activated" : "deactivated"} successfully`,
            data: activity,
        })
    } catch (error) {
        console.error("Toggle activity status error:", error)
        res.status(500).json({
            success: false,
            message: "Failed to toggle activity status",
            error: error.message,
        })
    }
}

// @desc    Reorder activities
// @route   PUT /api/activities/reorder
// @access  Private (Admin only)
exports.reorderActivities = async (req, res) => {
    try {
        const { activities } = req.body // Array of { id, order }

        if (!Array.isArray(activities)) {
            return res.status(400).json({
                success: false,
                message: "Invalid data format. Expected array of activities",
            })
        }

        // Update order for each activity
        const updatePromises = activities.map((item) => Activity.findByIdAndUpdate(item.id, { order: item.order }, { new: true }))

        await Promise.all(updatePromises)

        res.status(200).json({
            success: true,
            message: "Activities reordered successfully",
        })
    } catch (error) {
        console.error("Reorder activities error:", error)
        res.status(500).json({
            success: false,
            message: "Failed to reorder activities",
            error: error.message,
        })
    }
}
