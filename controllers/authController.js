const User = require("../models/User")
const Position = require("../models/Position")
const { generateToken } = require("../middleware/auth")
const { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema, arabicJoiMessages, updateUserSchema } = require("../utils/validation")
const { sendResetPasswordEmail } = require("../utils/email")
const { filterUserFields } = require("../utils/userFieldFilter")
const upload = require("../utils/upload")
const crypto = require("crypto")
const path = require("path")
const asyncHandler = require("../middleware/asyncHandler")

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
const register = asyncHandler(async (req, res, next) => {
    // Validate input
    const { error } = registerSchema.validate(req.body, { messages: arabicJoiMessages })
    
    if (error) {
        return res.status(400).json({
            status: 'error',
            message: error.details[0].message
        })
    }

    const { name, email, password, phone, university, role, nationalId, governorate, position, membershipNumber, membershipExpiry } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({
        $or: [{ email }, { nationalId }],
    })

    if (existingUser) {
        return res.status(400).json({
            status: 'error',
            message: "هذا المستخدم مسجل بالفعل بهذا البريد الإلكتروني أو الرقم القومي"
        })
    }

    // Validate position if provided
    if (position) {
        const validPosition = await Position.findById(position)
        if (!validPosition || !validPosition.isActive) {
            return res.status(400).json({
                status: 'error',
                message: "اللجنة المختارة غير صالحة"
            })
        }
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password,
        phone,
        university,
        nationalId,
        role,
        governorate,
        position,
        membershipNumber,
        membershipExpiry,
    })

    // Generate token
    const token = generateToken(user._id)

    const filteredUser = await filterUserFields(user, user)

    res.status(201).json({
        success: true,
        data: {
            token,
            user: filteredUser
        }
    })
})

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
const login = asyncHandler(async (req, res, next) => {
    // Validate input
    const { error } = loginSchema.validate(req.body, { messages: arabicJoiMessages })
    if (error) {
        return res.status(400).json({
            status: 'error',
            message: error.details[0].message
        })
    }

    const { email, password } = req.body

    // Check for user
    const user = await User.findOne({ email }).populate("position")

    if (!user) {
        return res.status(401).json({
            status: 'error',
            message: "بيانات الدخول غير صحيحة"
        })
    }

    // Check password
    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
        return res.status(401).json({
            status: 'error',
            message: "بيانات الدخول غير صحيحة"
        })
    }

    // Generate token
    const token = generateToken(user._id)

    const filteredUser = await filterUserFields(user, user)

    res.status(200).json({
        success: true,
        data: {
            token,
            user: filteredUser
        }
    })
})

// @desc    Get current user
// @route   GET /api/v1/users/me
// @access  Private
const getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).populate("position").populate("customFieldValues.fieldId")

    const filteredUser = await filterUserFields(req.user, user)

    res.status(200).json({
        success: true,
        data: filteredUser
    })
})

// @desc    Update current user
// @route   PUT /api/v1/users/me
// @access  Private
const updateMe = asyncHandler(async (req, res, next) => {
    // Check if this is a file upload (FormData)
    const isFormData = req.headers["content-type"]?.includes("multipart/form-data")

    // If FormData, multer parses arrays/objects as JSON strings
    if (isFormData && req.body.customFieldValues && typeof req.body.customFieldValues === 'string') {
        try {
            req.body.customFieldValues = JSON.parse(req.body.customFieldValues)
        } catch (e) {
            console.error("Failed to parse customFieldValues string")
        }
    }

    // Always validate input
    const { error } = updateUserSchema.validate(req.body, { messages: arabicJoiMessages })
    if (error) {
        return res.status(400).json({
            status: 'error',
            message: error.details[0].message
        })
    }

    // Validate position if provided
    if (req.body.position) {
        const validPosition = await Position.findById(req.body.position)
        if (!validPosition || !validPosition.isActive) {
            return res.status(400).json({
                status: 'error',
                message: "اللجنة المختارة غير صالحة"
            })
        }
    }

    // Prepare update data
    const updateData = { ...req.body }

    // Handle profile image upload if provided
    if (req.file) {
        updateData.profileImage = req.file.filename
    }

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
        new: true,
        runValidators: true,
    }).populate("position").populate("customFieldValues.fieldId")

    const filteredUser = await filterUserFields(req.user, user)

    res.status(200).json({
        success: true,
        data: { user: filteredUser }
    })
})

// @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res, next) => {
    // Validate input
    const { error } = forgotPasswordSchema.validate(req.body, { messages: arabicJoiMessages })
    if (error) {
        return res.status(400).json({
            status: 'error',
            message: error.details[0].message
        })
    }

    const { email } = req.body

    // Find user by email
    const user = await User.findOne({ email })

    if (!user) {
        return res.status(404).json({
            status: 'error',
            message: "لا يوجد مستخدم مسجل بهذا البريد الإلكتروني"
        })
    }

    // Generate reset token
    const resetToken = user.getResetPasswordToken()

    // Save user with reset token
    await user.save({ validateBeforeSave: false })

    // 🌟 تم الإصلاح: تمرير الـ token الصافي فقط والـ Template هيتكفل بالباقي
    const emailResult = await sendResetPasswordEmail(email, resetToken)

    if (!emailResult.success) {
        // Reset the token fields if email fails
        user.resetPasswordToken = undefined
        user.resetPasswordExpiry = undefined
        await user.save({ validateBeforeSave: false })

        return res.status(500).json({
            status: 'error',
            message: "فشل إرسال البريد الإلكتروني"
        })
    }

    res.status(200).json({
        success: true,
        message: "تم إرسال رمز إعادة تعيين كلمة المرور إلى بريدك الإلكتروني بنجاح"
    })
})

// @desc    Reset password
// @route   POST /api/v1/auth/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res, next) => {
    // Validate input
    const { error } = resetPasswordSchema.validate(req.body, { messages: arabicJoiMessages })
    if (error) {
        return res.status(400).json({
            status: 'error',
            message: error.details[0].message
        })
    }

    const { token, password } = req.body

    // Hash the token to compare with stored token
    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex")

    // Find user by reset token and check if token is still valid
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpiry: { $gt: Date.now() },
    })

    if (!user) {
        return res.status(400).json({
            status: 'error',
            message: "رمز إعادة تعيين كلمة المرور غير صالح أو منتهي الصلاحية"
        })
    }

    // Set new password
    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpiry = undefined

    await user.save()

    // Generate new JWT token
    const jwtToken = generateToken(user._id)

    const filteredUser = await filterUserFields(user, user)

    res.status(200).json({
        success: true,
        data: {
            message: "تم تغيير كلمة المرور بنجاح",
            token: jwtToken,
            user: filteredUser
        }
    })
})

// @desc    Change password
// @route   PUT /api/v1/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res, next) => {
    // Validate input
    const { error } = changePasswordSchema.validate(req.body, { messages: arabicJoiMessages })
    if (error) {
        return res.status(400).json({
            status: 'error',
            message: error.details[0].message
        })
    }

    const { currentPassword, newPassword } = req.body

    // Get user with password field
    const user = await User.findById(req.user.id).select("+password")

    // Check current password
    const isMatch = await user.matchPassword(currentPassword)

    if (!isMatch) {
        return res.status(400).json({
            status: 'error',
            message: "كلمة المرور الحالية غير صحيحة"
        })
    }

    // Set new password
    user.password = newPassword
    await user.save()

    // Generate new JWT token
    const token = generateToken(user._id)

    res.status(200).json({
        success: true,
        data: {
            message: "تم تغيير كلمة المرور بنجاح",
            token,
        }
    })
})

module.exports = {
    register,
    login,
    getMe,
    updateMe,
    forgotPassword,
    resetPassword,
    changePassword,
}