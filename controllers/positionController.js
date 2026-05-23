const Position = require("../models/Position")
const {positionSchema, arabicJoiMessages} = require("../utils/validation")
const { Filter } = require("../utils/Filter")
// @desc    Get all positions
// @route   GET /api/v1/positions
// @access  Public
const getPositions = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query
        req.query.isActive = true
        const search = Filter(req)
        // let filter = { isActive: true };
        const skip = (page - 1) * limit

        const total = await Position.countDocuments(search)

        const positions = await Position.find()
            .where(search)
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))

        res.status(200).json({
            status: 'error',
            message: null
        })
        }

        res.status(200).json({
            status: 'error',
            message: null
        })
        }

        // Add createdBy field
        req.body.createdBy = req.user.id

        // If position is global, remove governorate
        if (req.body.isGlobal) {
            req.body.governorate = null
        }

        const position = await Position.create(req.body)

        const populatedPosition = await Position.findById(position._id).populate("createdBy", "name email")

        res.status(201).json({
            status: 'error',
            message: null
        })
        }

        // If position is global, remove governorate
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
            status: 'error',
            message: null
        })
        }

        res.status(200).json({
            success: true,
            data: { message: "تم إلغاء تفعيل اللجنة بنجاح" },
            error: null,
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getPositions,
    getPosition,
    createPosition,
    updatePosition,
    deletePosition,
}
