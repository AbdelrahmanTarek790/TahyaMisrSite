const User = require("../models/User")
const Position = require("../models/Position")
const { generateToken } = require("../middleware/auth")
const { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema, arabicJoiMessages } = require("../utils/validation")
const { sendResetPasswordEmail } = require("../utils/email")
const { filterUserFields } = require("../utils/userFieldFilter")
const upload = require("../utils/upload")
const crypto = require("crypto")
const path = require("path")

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
const register = async (req, res, next) => {
    try {
        // Validate input
        const { error } = registerSchema.validate(req.body, { messages: arabicJoiMessages })
        console.log(error);
        
        if (error) {
            return res.status(400).json({
            status: 'error',
            message: error.details[0].message
        })
        }

        const { name, email, password, phone, university,role, nationalId, governorate, position, membershipNumber, membershipExpiry } = req.body

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
            status: 'error',
            message: null
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
            status: 'error',
            message: null
        })
            }
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
            status: 'error',
            message: null
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

        // Send email with reset token
        const emailResult = await sendResetPasswordEmail(email, `https://tahyamisryu.com/reset-password?token=${resetToken}`)

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
            status: 'error',
            message: null
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
            status: 'error',
            message: null
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
            },
            error: null,
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    register,
    login,
    getMe,
    updateMe,
    forgotPassword,
    resetPassword,
    changePassword,
}
