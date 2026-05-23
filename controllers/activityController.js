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
            status: 'error',
            message: "
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
            status: 'error',
            message: "لم يتم العثور على النشاط"
        })
        }

        res.status(200).json({
            status: 'error',
            message: "
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
            status: 'error',
            message: "العنوان مطلوب"
        })
        }

        // Handle image upload
        let imagePath = req.body.image
        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`
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
            status: 'error',
            message: "
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
            status: 'error',
            message: "لم يتم العثور على النشاط"
        })
        }

        // Handle image upload
        if (req.file) {
            activity.image = `/uploads/${req.file.filename}`
        } else if (req.body.image !== undefined) {
            activity.image = req.body.image
        }

        // Update fields
        if (title !== undefined) activity.title = title
        if (color !== undefined) activity.color = color
        if (order !== undefined) activity.order = order
        if (isActive !== undefined) activity.isActive = isActive

        await activity.save()

        res.status(200).json({
            status: 'error',
            message: "
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
            status: 'error',
            message: "لم يتم العثور على النشاط"
        })
        }

        await activity.deleteOne()

        res.status(200).json({
            status: 'error',
            message: "
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
            status: 'error',
            message: "لم يتم العثور على النشاط"
        })
        }

        activity.isActive = !activity.isActive
        await activity.save()

        res.status(200).json({
            status: 'error',
            message: "
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
            status: 'error',
            message: "تنسيق البيانات غير صحيح. المتوقع مصفوفة من الأنشطة"
        })
        }

        // Update order for each activity
        const updatePromises = activities.map((item) => Activity.findByIdAndUpdate(item.id, { order: item.order }, { new: true }))

        await Promise.all(updatePromises)

        res.status(200).json({
            status: 'error',
            message: "
        })
    }
}
