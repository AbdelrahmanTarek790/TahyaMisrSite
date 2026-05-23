const HonorMember = require("../models/HonorMember")
const asyncHandler = require("../middleware/asyncHandler")

// @desc    Get all honor members
// @route   GET /api/v1/honor-roll
// @access  Public
exports.getHonorMembers = asyncHandler(async (req, res, next) => {
    const { isActive } = req.query
    const filter = isActive !== undefined ? { isActive: isActive === "true" } : {}

    const members = await HonorMember.find(filter)
        .populate("user", "name profileImage university")
        .sort({ order: 1, createdAt: -1 })

    res.status(200).json({
        success: true,
        data: members
    })
})

// @desc    Create new honor member
// @route   POST /api/v1/honor-roll
// @access  Private (Admin only)
exports.createHonorMember = asyncHandler(async (req, res, next) => {
    const { userId, title, description, order, isActive } = req.body

    if (!userId || !title) {
        return res.status(400).json({
            status: 'error',
            message: "معرف المستخدم واللقب مطلوبان"
        })
    }

    const member = await HonorMember.create({
        user: userId,
        title,
        description,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
        createdBy: req.user._id,
    })

    const populatedMember = await member.populate("user", "name profileImage university")

    res.status(201).json({
        success: true,
        message: "تم إضافة العضو إلى لوحة الشرف بنجاح",
        data: populatedMember
    })
})

// @desc    Update honor member
// @route   PUT /api/v1/honor-roll/:id
// @access  Private (Admin only)
exports.updateHonorMember = asyncHandler(async (req, res, next) => {
    const { title, description, order, isActive, userId } = req.body

    let member = await HonorMember.findById(req.params.id)

    if (!member) {
        return res.status(404).json({
            status: 'error',
            message: "لم يتم العثور على عضو لوحة الشرف"
        })
    }

    if (userId) member.user = userId
    if (title) member.title = title
    if (description !== undefined) member.description = description
    if (order !== undefined) member.order = order
    if (isActive !== undefined) member.isActive = isActive

    await member.save()
    await member.populate("user", "name profileImage university")

    res.status(200).json({
        success: true,
        message: "تم تحديث عضو لوحة الشرف بنجاح",
        data: member
    })
})

// @desc    Delete honor member
// @route   DELETE /api/v1/honor-roll/:id
// @access  Private (Admin only)
exports.deleteHonorMember = asyncHandler(async (req, res, next) => {
    const member = await HonorMember.findById(req.params.id)

    if (!member) {
        return res.status(404).json({
            status: 'error',
            message: "لم يتم العثور على عضو لوحة الشرف"
        })
    }

    await member.deleteOne()

    res.status(200).json({
        success: true,
        message: "تم حذف عضو لوحة الشرف بنجاح",
        data: {}
    })
})
