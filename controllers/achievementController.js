const Achievement = require("../models/Achievement")
const asyncHandler = require("../middleware/asyncHandler")

// @desc    Get all achievements
// @route   GET /api/achievements
// @access  Public
exports.getAchievements = asyncHandler(async (req, res, next) => {
    const { isActive } = req.query
    const filter = isActive !== undefined ? { isActive: isActive === "true" } : {}

    const achievements = await Achievement.find(filter).sort({ order: 1, createdAt: -1 }).populate("createdBy", "name email")

    res.status(200).json({
        success: true,
        count: achievements.length,
        data: achievements
    })
})

// @desc    Get single achievement by ID
// @route   GET /api/achievements/:id
// @access  Public
exports.getAchievementById = asyncHandler(async (req, res, next) => {
    const achievement = await Achievement.findById(req.params.id).populate("createdBy", "name email")

    if (!achievement) {
        return res.status(404).json({
            status: 'error',
            message: "لم يتم العثور على الإنجاز"
        })
    }

    res.status(200).json({
        success: true,
        data: achievement
    })
})

// @desc    Create new achievement
// @route   POST /api/achievements
// @access  Private (Admin only)
exports.createAchievement = asyncHandler(async (req, res, next) => {
    const { title, description, highlights, color, icon, order, isActive } = req.body

    // Validate required fields
    if (!title || !description) {
        return res.status(400).json({
            status: 'error',
            message: "العنوان والوصف مطلوبان"
        })
    }

    // Handle image upload
    let imagePath = null
    if (req.file) {
        imagePath = `/uploads/${req.file.filename}`
    } else if (req.body.image && typeof req.body.image === "string" && req.body.image.trim() !== "") {
        imagePath = req.body.image
    }

    // Parse highlights if it's a JSON string
    let parsedHighlights = highlights || []
    if (typeof highlights === "string") {
        try {
            parsedHighlights = JSON.parse(highlights)
        } catch (e) {
            parsedHighlights = []
        }
    }

    const achievement = await Achievement.create({
        title,
        description,
        highlights: parsedHighlights,
        color: color || "text-egypt-gold",
        image: imagePath,
        icon: icon || "Award",
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
        createdBy: req.user._id,
    })

    res.status(201).json({
        success: true,
        message: "تم إنشاء الإنجاز بنجاح",
        data: achievement
    })
})

// @desc    Update achievement
// @route   PUT /api/achievements/:id
// @access  Private (Admin only)
exports.updateAchievement = asyncHandler(async (req, res, next) => {
    const { title, description, highlights, color, icon, order, isActive } = req.body

    let achievement = await Achievement.findById(req.params.id)

    if (!achievement) {
        return res.status(404).json({
            status: 'error',
            message: "لم يتم العثور على الإنجاز"
        })
    }

    // Handle image upload
    if (req.file) {
        achievement.image = `/uploads/${req.file.filename}`
    } else if (req.body.image !== undefined) {
        if (typeof req.body.image === "string" && req.body.image.trim() !== "") {
            achievement.image = req.body.image
        } else if (req.body.image === "" || req.body.image === null) {
            achievement.image = null
        }
    }

    // Update fields
    if (title !== undefined) achievement.title = title
    if (description !== undefined) achievement.description = description
    if (highlights !== undefined) {
        if (typeof highlights === "string") {
            try {
                achievement.highlights = JSON.parse(highlights)
            } catch (e) {
                achievement.highlights = []
            }
        } else {
            achievement.highlights = highlights
        }
    }
    if (color !== undefined) achievement.color = color
    if (icon !== undefined) achievement.icon = icon
    if (order !== undefined) achievement.order = order
    if (isActive !== undefined) achievement.isActive = isActive

    await achievement.save()

    res.status(200).json({
        success: true,
        message: "تم تحديث الإنجاز بنجاح",
        data: achievement
    })
})

// @desc    Delete achievement
// @route   DELETE /api/achievements/:id
// @access  Private (Admin only)
exports.deleteAchievement = asyncHandler(async (req, res, next) => {
    const achievement = await Achievement.findById(req.params.id)

    if (!achievement) {
        return res.status(404).json({
            status: 'error',
            message: "لم يتم العثور على الإنجاز"
        })
    }

    await achievement.deleteOne()

    res.status(200).json({
        success: true,
        message: "تم حذف الإنجاز بنجاح",
        data: {}
    })
})

// @desc    Toggle achievement active status
// @route   PATCH /api/achievements/:id/toggle
// @access  Private (Admin only)
exports.toggleAchievementStatus = asyncHandler(async (req, res, next) => {
    const achievement = await Achievement.findById(req.params.id)

    if (!achievement) {
        return res.status(404).json({
            status: 'error',
            message: "لم يتم العثور على الإنجاز"
        })
    }

    achievement.isActive = !achievement.isActive
    await achievement.save()

    res.status(200).json({
        success: true,
        message: `تم ${achievement.isActive ? "تفعيل" : "تعطيل"} الإنجاز بنجاح`,
        data: achievement
    })
})

// @desc    Reorder achievements
// @route   PUT /api/achievements/reorder
// @access  Private (Admin only)
exports.reorderAchievements = asyncHandler(async (req, res, next) => {
    const { achievements } = req.body // Array of { id, order }

    if (!Array.isArray(achievements)) {
        return res.status(400).json({
            status: 'error',
            message: "تنسيق البيانات غير صحيح. المتوقع مصفوفة من الإنجازات"
        })
    }

    const updatePromises = achievements.map((item) => Achievement.findByIdAndUpdate(item.id, { order: item.order }, { new: true }))

    await Promise.all(updatePromises)

    res.status(200).json({
        success: true,
        message: "تم إعادة ترتيب الإنجازات بنجاح"
    })
})
