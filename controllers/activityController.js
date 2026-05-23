const Activity = require("../models/Activity")
const asyncHandler = require("../middleware/asyncHandler")

// @desc    Get all activities
// @route   GET /api/activities
// @access  Public
exports.getActivities = asyncHandler(async (req, res, next) => {
    const { isActive } = req.query
    const filter = isActive !== undefined ? { isActive: isActive === "true" } : {}

    const activities = await Activity.find(filter).sort({ order: 1, createdAt: -1 }).populate("createdBy", "name email")

    res.status(200).json({
        success: true,
        data: activities
    })
})

// @desc    Get single activity by ID
// @route   GET /api/activities/:id
// @access  Public
exports.getActivityById = asyncHandler(async (req, res, next) => {
    const activity = await Activity.findById(req.params.id).populate("createdBy", "name email")

    if (!activity) {
        return res.status(404).json({
            status: 'error',
            message: "لم يتم العثور على النشاط"
        })
    }

    res.status(200).json({
        success: true,
        data: activity
    })
})

// @desc    Create new activity
// @route   POST /api/activities
// @access  Private (Admin only)
exports.createActivity = asyncHandler(async (req, res, next) => {
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
        success: true,
        message: "تم إنشاء النشاط بنجاح",
        data: activity
    })
})

// @desc    Update activity
// @route   PUT /api/activities/:id
// @access  Private (Admin only)
exports.updateActivity = asyncHandler(async (req, res, next) => {
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
        success: true,
        message: "تم تحديث النشاط بنجاح",
        data: activity
    })
})

// @desc    Delete activity
// @route   DELETE /api/activities/:id
// @access  Private (Admin only)
exports.deleteActivity = asyncHandler(async (req, res, next) => {
    const activity = await Activity.findById(req.params.id)

    if (!activity) {
        return res.status(404).json({
            status: 'error',
            message: "لم يتم العثور على النشاط"
        })
    }

    await activity.deleteOne()

    res.status(200).json({
        success: true,
        message: "تم حذف النشاط بنجاح",
        data: {}
    })
})

// @desc    Toggle activity active status
// @route   PATCH /api/activities/:id/toggle
// @access  Private (Admin only)
exports.toggleActivityStatus = asyncHandler(async (req, res, next) => {
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
        success: true,
        message: `تم ${activity.isActive ? "تفعيل" : "تعطيل"} النشاط بنجاح`,
        data: activity
    })
})

// @desc    Reorder activities
// @route   PUT /api/activities/reorder
// @access  Private (Admin only)
exports.reorderActivities = asyncHandler(async (req, res, next) => {
    const { activities } = req.body // Array of { id, order }

    if (!Array.isArray(activities)) {
        return res.status(400).json({
            status: 'error',
            message: "تنسيق البيانات غير صحيح. المتوقع مصفوفة من الأنشطة"
        })
    }

    const updatePromises = activities.map((item) => Activity.findByIdAndUpdate(item.id, { order: item.order }, { new: true }))

    await Promise.all(updatePromises)

    res.status(200).json({
        success: true,
        message: "تم إعادة ترتيب الأنشطة بنجاح"
    })
})
