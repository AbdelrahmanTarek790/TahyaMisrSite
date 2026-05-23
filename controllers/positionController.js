const Position = require("../models/Position")
const {positionSchema, arabicJoiMessages} = require("../utils/validation")
const { Filter } = require("../utils/Filter")
const asyncHandler = require("../middleware/asyncHandler")

// @desc    Get all positions
// @route   GET /api/v1/positions
// @access  Public
const getPositions = asyncHandler(async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query
    req.query.isActive = true
    const search = Filter(req)
    const skip = (page - 1) * limit

    const total = await Position.countDocuments(search)

    const positions = await Position.find()
        .where(search)
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))

    res.status(200).json({
        success: true,
        data: {
                positions,
                pagination: {
                    current: parseInt(page),
                    total: Math.ceil(total / limit),
                    count: positions.length,
                    totalCount: total,
                },
            },
    })
})

// @desc    Get single position
// @route   GET /api/v1/positions/:id
// @access  Public
const getPosition = asyncHandler(async (req, res, next) => {
    const position = await Position.findById(req.params.id).populate("createdBy", "name email")
    if (!position) {
        return res.status(404).json({
            status: 'error',
            message: "لم يتم العثور على اللجنة"
        })
    }
    res.status(200).json({
        success: true,
        data: position
    })
})

// @desc    Create position
// @route   POST /api/v1/positions
// @access  Private/Admin
const createPosition = asyncHandler(async (req, res, next) => {
    const { error } = positionSchema.validate(req.body, { messages: arabicJoiMessages })
    if (error) {
        return res.status(400).json({
            status: 'error',
            message: error.details[0].message
        })
    }

    req.body.createdBy = req.user.id

    if (req.body.isGlobal) {
        req.body.governorate = null
    }

    const position = await Position.create(req.body)
    const populatedPosition = await Position.findById(position._id).populate("createdBy", "name email")

    res.status(201).json({
        success: true,
        data: populatedPosition
    })
})

// @desc    Update position
// @route   PUT /api/v1/positions/:id
// @access  Private/Admin
const updatePosition = asyncHandler(async (req, res, next) => {
    if (req.body.isGlobal) {
        req.body.governorate = null
    }

    const position = await Position.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    }).populate("createdBy", "name email")

    if (!position) {
        return res.status(404).json({
            status: 'error',
            message: "لم يتم العثور على اللجنة"
        })
    }

    res.status(200).json({
        success: true,
        data: position
    })
})

// @desc    Delete position (deactivate)
// @route   DELETE /api/v1/positions/:id
// @access  Private/Admin
const deletePosition = asyncHandler(async (req, res, next) => {
    const position = await Position.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true })
    if (!position) {
        return res.status(404).json({
            status: 'error',
            message: "لم يتم العثور على اللجنة"
        })
    }
    res.status(200).json({
        success: true,
        message: "تم إلغاء تفعيل اللجنة بنجاح"
    })
})

module.exports = {
    getPositions,
    getPosition,
    createPosition,
    updatePosition,
    deletePosition,
}
