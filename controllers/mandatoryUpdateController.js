const MandatoryUpdate = require("../models/MandatoryUpdate")
const User = require("../models/User")
const CustomField = require("../models/CustomField")
const { mandatoryUpdateSchema, completeMandatoryUpdateSchema, arabicJoiMessages } = require("../utils/validation")
const { sendMandatoryUpdateNotification } = require("../utils/email")
const asyncHandler = require("../middleware/asyncHandler")

const CORE_FIELDS = [
    { _id: "core_name", label: "الاسم", type: "text" },
    { _id: "core_phone", label: "رقم الهاتف", type: "phone" },
    { _id: "core_nationalId", label: "الرقم القومي", type: "text" },
    { _id: "core_university", label: "الجامعة", type: "text" },
    { _id: "core_governorate", label: "المحافظة", type: "text" },
    { _id: "core_email", label: "البريد الإلكتروني", type: "email" }
]

const resolveMixedFields = async (update) => {
    const fields = (update.fields || []).map(f => f.toString())
    const customFieldIds = fields.filter(f => !f.startsWith("core_"))
    const coreFieldIds = fields.filter(f => f.startsWith("core_"))

    const customFields = await CustomField.find({ _id: { $in: customFieldIds } }).lean()
    
    const resolvedCoreFields = coreFieldIds.map(id => CORE_FIELDS.find(c => c._id === id)).filter(Boolean)
    
    // Maintain original order or just concat
    return [...resolvedCoreFields, ...customFields]
}

// البريد الإلكتروني المخصص لمراجعي آبل لتخطي الحجب
const APPLE_REVIEWER_EMAIL = "apple@tahyamisryu.com"

// @desc     Get pending mandatory updates for current user
// @route    GET /api/v1/mandatory-updates
// @access   Private
const getMandatoryUpdates = asyncHandler(async (req, res, next) => {
    const userId = req.user._id
    const userEmail = req.user.email?.toLowerCase()

    // 🚨 تخطي حساب مراجعة آبل تماماً وإرجاع قائمة فارغة
    if (userEmail === APPLE_REVIEWER_EMAIL) {
        return res.status(200).json({
            success: true,
            data: []
        })
    }

    // جلب التحديثات الإلزامية النشطة الموجهة للمستخدم (إما عامة للكل أو مخصصة لمعرف المستخدم هذا)
    // والتي لم يقم المستخدم بإكمالها بعد
    const pendingUpdates = await MandatoryUpdate.find({
        isActive: true,
        $or: [
            { targetType: "global" },
            { targetUserIds: userId }
        ],
        completedBy: { $ne: userId }
    }).lean()

    for (const update of pendingUpdates) {
        update.fields = await resolveMixedFields(update)
    }

    // جلب الحقول الديناميكية النشطة وحساب المفقود منها
    const activeCustomFields = await CustomField.find({ status: "active" })
    const user = await User.findById(userId).lean()
    
    const missingFields = activeCustomFields.filter(cf => {
        const userValueObj = user.customFieldValues?.find(v => 
            v.fieldId && v.fieldId.toString() === cf._id.toString()
        )
        if (!userValueObj) return true
        
        const val = userValueObj.value
        if (cf.type === "checkbox_list") {
            return !Array.isArray(val) || val.length === 0
        }
        return !val || (typeof val === "string" && val.trim() === "")
    })

    res.status(200).json({
        success: true,
        data: {
            pendingUpdates,
            missingFields
        }
    })
})

// @desc     Get all mandatory updates for Admin Dashboard
// @route    GET /api/v1/mandatory-updates/admin
// @access   Private/Admin
const getAdminMandatoryUpdates = asyncHandler(async (req, res, next) => {
    const updates = await MandatoryUpdate.find().populate("createdBy", "name email").lean()

    for (const update of updates) {
        update.fields = await resolveMixedFields(update)
    }
        
    res.status(200).json({
        success: true,
        data: updates
    })
})

// @desc     Create new mandatory update rule
// @route    POST /api/v1/mandatory-updates
// @access   Private/Admin
const createMandatoryUpdate = asyncHandler(async (req, res, next) => {
    // التحقق من المدخلات عبر Joi
    const { error } = mandatoryUpdateSchema.validate(req.body, { messages: arabicJoiMessages })
    if (error) {
        return res.status(400).json({
            status: 'error',
            message: error.details[0].message
        })
    }

    // التأكد من صحة معرفات الحقول الديناميكية المرسلة ونشاطها
    const customFieldIds = req.body.fields.filter(f => !f.startsWith("core_"))
    const coreFieldIds = req.body.fields.filter(f => f.startsWith("core_"))

    const invalidCore = coreFieldIds.filter(id => !CORE_FIELDS.find(c => c._id === id))
    if (invalidCore.length > 0) {
        return res.status(400).json({
            status: 'error',
            message: "معرفات الحقول الأساسية غير صالحة"
        })
    }

    if (customFieldIds.length > 0) {
        const fieldCount = await CustomField.countDocuments({
            _id: { $in: customFieldIds },
            status: "active",
        })
        if (fieldCount !== customFieldIds.length) {
            return res.status(400).json({
                status: 'error',
                message: "واحد أو أكثر من معرفات الحقول غير صالحة أو غير نشطة"
            })
        }
    }

    // التحقق من معرفات المستخدمين في حال كان التحديث مستهدفاً لأعضاء محددين
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

    // إنشاء التحديث في قاعدة البيانات
    const update = await MandatoryUpdate.create({
        ...req.body,
        createdBy: req.user._id,
    })

    await update.populate("fields")
    await update.populate("createdBy", "name email")

    // إرسال الإشعارات بالبريد الإلكتروني بناءً على اختيار الأدمن (Opt-in)
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

            const emailPromises = targetUsers.map((user) =>
                sendMandatoryUpdateNotification(user.email, user.name, req.body.adminMessage).catch(
                    (err) => console.error(`Failed to send email to ${user.email}:`, err)
                )
            )
            await Promise.allSettled(emailPromises)
        } catch (emailError) {
            console.error("Error sending notification emails:", emailError)
        }
    }

    res.status(201).json({
        success: true,
        message: "تم إنشاء التحديث الإلزامي وتفعيل القاعدة بنجاح",
        data: update
    })
})

// @desc     Update mandatory update rule
// @route    PUT /api/v1/mandatory-updates/:id
// @access   Private/Admin
const updateMandatoryUpdate = asyncHandler(async (req, res, next) => {
    const update = await MandatoryUpdate.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    }).lean()

    if (!update) {
        return res.status(404).json({
            status: 'error',
            message: "لم يتم العثور على التحديث الإلزامي المطلوب"
        })
    }

    update.fields = await resolveMixedFields(update)

    res.status(200).json({
        success: true,
        message: "تم تحديث التحديث الإلزامي بنجاح",
        data: update
    })
})

// @desc     Delete mandatory update rule
// @route    DELETE /api/v1/mandatory-updates/:id
// @access   Private/Admin
const deleteMandatoryUpdate = asyncHandler(async (req, res, next) => {
    const update = await MandatoryUpdate.findByIdAndDelete(req.params.id)
    
    if (!update) {
        return res.status(404).json({
            status: 'error',
            message: "لم يتم العثور على التحديث الإلزامي المطلوبة لحذفه"
        })
    }

    res.status(200).json({
        success: true,
        message: "تم حذف قاعدة التحديث الإلزامي بنجاح"
    })
})

// @desc     User submits dynamic custom field values to complete an update
// @route    POST /api/v1/mandatory-updates/:id/complete
// @access   Private
const completeMandatoryUpdate = asyncHandler(async (req, res, next) => {
    const update = await MandatoryUpdate.findById(req.params.id)

    if (!update) {
        return res.status(404).json({
            status: 'error',
            message: "لم يتم العثور على التحديث الإلزامي"
        })
    }

    // التحقق مما إذا كان العضو قد أكمل هذا التحديث مسبقاً
    if (update.completedBy.includes(req.user._id)) {
        return res.status(400).json({
            status: 'error',
            message: "لقد أكملت هذا التحديث بالفعل مسبقاً"
        })
    }

    // التأكد من إرسال كافة الحقول المطلوبة في هذا التحديث الإلزامي
    const requiredFieldIds = update.fields.map(f => f.toString())
    const submittedFieldIds = req.body.customFieldValues.map((v) => v.fieldId)
    const missingFields = requiredFieldIds.filter((id) => !submittedFieldIds.includes(id))

    if (missingFields.length > 0) {
        return res.status(400).json({
            status: 'error',
            message: "برجاء استكمال ملء جميع الحقول الإلزامية المطلوبة للمتابعة."
        })
    }

    const user = await User.findById(req.user._id)

    // تحديث البيانات إما في الحقول الأساسية أو في القيم الديناميكية للعضو
    for (const { fieldId, value } of req.body.customFieldValues) {
        if (fieldId.startsWith("core_")) {
            // Update core field
            const coreKey = fieldId.replace("core_", "")
            user[coreKey] = value
        } else {
            // Update custom field
            const existingIndex = user.customFieldValues.findIndex(
                (cfv) => cfv.fieldId.toString() === fieldId
            )
            if (existingIndex !== -1) {
                user.customFieldValues[existingIndex].value = value
            } else {
                user.customFieldValues.push({ fieldId, value })
            }
        }
    }

    // 🌟 إعلام المونجوس صراحة بتعديل حقل الـ Mixed ليتم حفظ المصفوفات بشكل سليم
    user.markModified('customFieldValues')
    await user.save({ validateBeforeSave: false })

    // إضافة معرف المستخدم الحالي لقائمة المكتملين بالتحديث الإلزامي
    update.completedBy.push(req.user._id)
    await update.save()

    res.status(200).json({
        success: true,
        message: "تم إكمال التحديث الإلزامي وحفظ البيانات بنجاح",
        data: { user }
    })
})

module.exports = {
    getMandatoryUpdates,
    getAdminMandatoryUpdates,
    createMandatoryUpdate,
    updateMandatoryUpdate,
    deleteMandatoryUpdate,
    completeMandatoryUpdate,
}