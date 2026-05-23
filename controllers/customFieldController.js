const CustomField = require("../models/CustomField")
const {customFieldSchema, arabicJoiMessages} = require("../utils/validation")
const asyncHandler = require("../middleware/asyncHandler")

// @desc    Get all custom fields
// @route   GET /api/v1/custom-fields
// @access  Private
const getCustomFields = asyncHandler(async (req, res, next) => {
    const query = {}

    // Filter by status if provided
    if (req.query.status) {
        query.status = req.query.status
    }

    const fields = await CustomField.find(query).sort({ order: 1, createdAt: -1 })

    res.status(200).json({
        success: true,
        data: fields
    })
})

// @desc    Get single custom field
// @route   GET /api/v1/custom-fields/:id
// @access  Private
const getCustomField = asyncHandler(async (req, res, next) => {
    const field = await CustomField.findById(req.params.id)
    if (!field) {
        return res.status(404).json({
            status: 'error',
            message: "لم يتم العثور على الحقل المخصص"
        })
    }
    res.status(200).json({
        success: true,
        data: field
    })
})

// @desc    Create custom field
// @route   POST /api/v1/custom-fields
// @access  Private
const createCustomField = asyncHandler(async (req, res, next) => {
    const { error } = customFieldSchema.validate(req.body, { messages: arabicJoiMessages })
    if (error) {
        return res.status(400).json({
            status: 'error',
            message: error.details[0].message
        })
    }
    const field = await CustomField.create(req.body)
    res.status(201).json({
        success: true,
        data: field
    })
})

// @desc    Update custom field
// @route   PUT /api/v1/custom-fields/:id
// @access  Private
const updateCustomField = asyncHandler(async (req, res, next) => {
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
        success: true,
        data: field
    })
})

// @desc    Delete custom field
// @route   DELETE /api/v1/custom-fields/:id
// @access  Private
const deleteCustomField = asyncHandler(async (req, res, next) => {
    const field = await CustomField.findById(req.params.id)
    if (!field) {
        return res.status(404).json({
            status: 'error',
            message: "لم يتم العثور على الحقل المخصص"
        })
    }
    await field.deleteOne()
    res.status(200).json({
        success: true,
        message: "تم حذف الحقل المخصص بنجاح"
    })
})

module.exports = {
    getCustomFields,
    getCustomField,
    createCustomField,
    updateCustomField,
    deleteCustomField,
}
