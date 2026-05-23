const CustomField = require("../models/CustomField")
const {customFieldSchema, arabicJoiMessages} = require("../utils/validation")

// @desc    Get all custom fields
// @route   GET /api/v1/custom-fields
// @access  Private
const getCustomFields = async (req, res, next) => {
    try {
        const query = {}

        // Filter by status if provided
        if (req.query.status) {
            query.status = req.query.status
        }

        const fields = await CustomField.find(query).sort({ order: 1, createdAt: -1 })

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

        const field = await CustomField.create(req.body)

        res.status(201).json({
            status: 'error',
            message: null
        })
        }

        const field = await CustomField.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })

        if (!field) {
            return res.status(404).json({
            status: 'error',
            message: "لم يتم العثور على الحقل المخصص"
        })
        }

        res.status(200).json({
            status: 'error',
            message: null
        })
        }

        await CustomField.findByIdAndDelete(req.params.id)

        res.status(200).json({
            success: true,
            data: { message: "تم حذف الحقل المخصص بنجاح" },
            error: null,
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getCustomFields,
    getCustomField,
    createCustomField,
    updateCustomField,
    deleteCustomField,
}
