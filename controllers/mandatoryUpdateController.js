const MandatoryUpdate = require("../models/MandatoryUpdate")
const User = require("../models/User")
const CustomField = require("../models/CustomField")
const {mandatoryUpdateSchema, completeMandatoryUpdateSchema, arabicJoiMessages} = require("../utils/validation")
const { sendMandatoryUpdateNotification } = require("../utils/email")

// Apple test account email — bypasses all mandatory checks
const APPLE_REVIEWER_EMAIL = "apple@tahyamisryu.com"

// @desc    Get pending mandatory updates for current user
// @route   GET /api/v1/mandatory-updates
// @access  Private
const getMandatoryUpdates = async (req, res, next) => {
    try {
        const userId = req.user._id
        const userEmail = req.user.email?.toLowerCase()

        // Apple reviewer bypass — return empty list (no pending updates)
        if (userEmail === APPLE_REVIEWER_EMAIL) {
            return res.status(200).json({
            status: 'error',
            message: null
        })
        }

        // Validate that all field IDs exist
        const fieldCount = await CustomField.countDocuments({
            _id: { $in: req.body.fields },
            status: "active",
        })
        if (fieldCount !== req.body.fields.length) {
            return res.status(400).json({
            status: 'error',
            message: "واحد أو أكثر من معرفات الحقول غير صالحة أو غير نشطة"
        })
        }

        // If targeted, validate user IDs
        if (req.body.targetType === "targeted") {
            if (!req.body.targetUserIds || req.body.targetUserIds.length === 0) {
                return res.status(400).json({
            status: 'error',
            message: "التحديثات المستهدفة تتطلب معرف مستخدم واحد على الأقل"
        })
            }
            const userCount = await User.countDocuments({
                _id: { $in: req.body.targetUserIds },
            })
            if (userCount !== req.body.targetUserIds.length) {
                return res.status(400).json({
            status: 'error',
            message: "واحد أو أكثر من معرفات المستخدمين غير صالحة"
        })
            }
        }

        const update = await MandatoryUpdate.create({
            ...req.body,
            createdBy: req.user._id,
        })

        // Populate for response
        await update.populate("fields")
        await update.populate("createdBy", "name email")

        // Send email notifications if requested
        if (req.body.notifyByEmail) {
            try {
                let targetUsers
                if (req.body.targetType === "global") {
                    targetUsers = await User.find({}, "name email")
                } else {
                    targetUsers = await User.find(
                        { _id: { $in: req.body.targetUserIds } },
                        "name email"
                    )
                }

                // Send emails in parallel (non-blocking, errors logged but not thrown)
                const emailPromises = targetUsers.map((user) =>
                    sendMandatoryUpdateNotification(user.email, user.name, req.body.adminMessage).catch(
                        (err) => console.error(`Failed to send email to ${user.email}:`, err)
                    )
                )
                await Promise.allSettled(emailPromises)
            } catch (emailError) {
                console.error("Error sending notification emails:", emailError)
                // Don't fail the request — the rule was created successfully
            }
        }

        res.status(201).json({
            status: 'error',
            message: null
        })
        }

        res.status(200).json({
            status: 'error',
            message: null
        })
        }

        await MandatoryUpdate.findByIdAndDelete(req.params.id)

        res.status(200).json({
            status: 'error',
            message: null
        })
        }

        const update = await MandatoryUpdate.findById(req.params.id).populate("fields")

        if (!update) {
            return res.status(404).json({
            status: 'error',
            message: "لم يتم العثور على التحديث الإلزامي"
        })
        }

        // Check if user is already completed
        if (update.completedBy.includes(req.user._id)) {
            return res.status(400).json({
            status: 'error',
            message: "لقد أكملت هذا التحديث بالفعل"
        })
        }

        // Validate that all required fields are submitted
        const requiredFieldIds = update.fields.map((f) => f._id.toString())
        const submittedFieldIds = req.body.customFieldValues.map((v) => v.fieldId)
        const missingFields = requiredFieldIds.filter((id) => !submittedFieldIds.includes(id))

        if (missingFields.length > 0) {
            return res.status(400).json({
            status: 'error',
            message: `Missing required fields: ${missingFields.join("
        })
        }

        // Save custom field values to user using atomic array updates
        const user = await User.findById(req.user._id)

        for (const { fieldId, value } of req.body.customFieldValues) {
            const existingIndex = user.customFieldValues.findIndex(
                (cfv) => cfv.fieldId.toString() === fieldId
            )
            if (existingIndex !== -1) {
                // Update existing value
                user.customFieldValues[existingIndex].value = value
            } else {
                // Add new value
                user.customFieldValues.push({ fieldId, value })
            }
        }

        await user.save({ validateBeforeSave: false })

        // Mark update as completed by this user
        update.completedBy.push(req.user._id)
        await update.save()

        res.status(200).json({
            success: true,
            data: {
                message: "تم إكمال التحديث الإلزامي بنجاح",
                user,
            },
            error: null,
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getMandatoryUpdates,
    getAdminMandatoryUpdates,
    createMandatoryUpdate,
    updateMandatoryUpdate,
    deleteMandatoryUpdate,
    completeMandatoryUpdate,
}
