const Achievement = require("../models/Achievement")

// @desc    Get all achievements
// @route   GET /api/achievements
// @access  Public
exports.getAchievements = async (req, res) => {
    try {
        const { isActive } = req.query
        const filter = isActive !== undefined ? { isActive: isActive === "true" } : {}

        const achievements = await Achievement.find(filter).sort({ order: 1, createdAt: -1 }).populate("createdBy", "name email")

        res.status(200).json({
            status: 'error',
            message: "
        })
    }
}

// @desc    Get single achievement by ID
// @route   GET /api/achievements/:id
// @access  Public
exports.getAchievementById = async (req, res) => {
    try {
        const achievement = await Achievement.findById(req.params.id).populate("createdBy", "name email")

        if (!achievement) {
            return res.status(404).json({
            status: 'error',
            message: "لم يتم العثور على الإنجاز"
        })
        }

        res.status(200).json({
            status: 'error',
            message: "
        })
    }
}

// @desc    Create new achievement
// @route   POST /api/achievements
// @access  Private (Admin only)
exports.createAchievement = async (req, res) => {
    try {
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
            status: 'error',
            message: "
        })
    }
}

// @desc    Update achievement
// @route   PUT /api/achievements/:id
// @access  Private (Admin only)
exports.updateAchievement = async (req, res) => {
    try {
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
            // Only update if it's a valid string
            if (typeof req.body.image === "string" && req.body.image.trim() !== "") {
                achievement.image = req.body.image
            } else if (req.body.image === "" || req.body.image === null) {
                // Explicitly set to null if empty string or null
                achievement.image = null
            }
        }

        // Update fields
        if (title !== undefined) achievement.title = title
        if (description !== undefined) achievement.description = description
        if (highlights !== undefined) {
            // Parse highlights if it's a JSON string
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
            status: 'error',
            message: "
        })
    }
}

// @desc    Delete achievement
// @route   DELETE /api/achievements/:id
// @access  Private (Admin only)
exports.deleteAchievement = async (req, res) => {
    try {
        const achievement = await Achievement.findById(req.params.id)

        if (!achievement) {
            return res.status(404).json({
            status: 'error',
            message: "لم يتم العثور على الإنجاز"
        })
        }

        await achievement.deleteOne()

        res.status(200).json({
            status: 'error',
            message: "
        })
    }
}

// @desc    Toggle achievement active status
// @route   PATCH /api/achievements/:id/toggle
// @access  Private (Admin only)
exports.toggleAchievementStatus = async (req, res) => {
    try {
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
            status: 'error',
            message: "
        })
    }
}

// @desc    Reorder achievements
// @route   PUT /api/achievements/reorder
// @access  Private (Admin only)
exports.reorderAchievements = async (req, res) => {
    try {
        const { achievements } = req.body // Array of { id, order }

        if (!Array.isArray(achievements)) {
            return res.status(400).json({
            status: 'error',
            message: "تنسيق البيانات غير صحيح. المتوقع مصفوفة من الإنجازات"
        })
        }

        // Update order for each achievement
        const updatePromises = achievements.map((item) => Achievement.findByIdAndUpdate(item.id, { order: item.order }, { new: true }))

        await Promise.all(updatePromises)

        res.status(200).json({
            status: 'error',
            message: "
        })
    }
}
