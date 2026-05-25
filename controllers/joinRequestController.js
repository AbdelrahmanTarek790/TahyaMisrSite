const JoinRequest = require("../models/JoinRequest")
const User = require("../models/User")
const Position = require("../models/Position")
const SiteSettings = require("../models/SiteSettings")
const { generateToken } = require("../middleware/auth")
const { sendJoinRequestSubmitted, sendJoinRequestApproved, sendJoinRequestDenied, sendVerificationOtpEmail } = require("../utils/email")
const { Filter } = require("../utils/Filter")

// @desc    Create a new join request
// @route   POST /api/v1/join-requests
// @access  Public
const createJoinRequest = async (req, res, next) => {
    try {
        // Check if join requests are enabled
        const settings = await SiteSettings.getSettings()
        if (!settings.joinRequestsEnabled) {
            return res.status(403).json({
                success: false,
                error: settings.joinRequestMessage || "طلبات الانضمام معطلة حاليًا",
                data: null,
            })
        }

        const { name, email, phone, nationalID, governorate, position, membershipNumber, notes } = req.body

        // Validate required fields
        if (!name || !email || !phone || !nationalID || !governorate) {
            return res.status(400).json({
                success: false,
                error: "الاسم، البريد الإلكتروني، الهاتف، الرقم القومي، والمحافظة مطلوبة",
                data: null,
            })
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { nationalId: nationalID }],
        })

        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: "تم قبول حسابك بالفعل، برجاء فحص بريدك الإلكتروني للحصول على كلمة المرور المؤقتة وتسجيل الدخول.",
                data: null,
            })
        }

        // Check if there's already a request
        let existingRequest = await JoinRequest.findOne({
            $or: [{ email }, { nationalID }],
        })

        if (existingRequest) {
            if (existingRequest.isVerified) {
                if (existingRequest.status === "pending") {
                    return res.status(400).json({
                        success: false,
                        error: "طلب الانضمام الخاص بك قيد المراجعة حالياً، وسيتم إرسال كلمة المرور فور القبول.",
                        data: null,
                    })
                } else if (existingRequest.status === "approved") {
                    return res.status(400).json({
                        success: false,
                        error: "تم قبول حسابك بالفعل، برجاء فحص بريدك الإلكتروني للحصول على كلمة المرور المؤقتة وتسجيل الدخول.",
                        data: null,
                    })
                }
            } else {
                // Overwrite unverified request with new OTP
                const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
                const otpExpires = Date.now() + 15 * 60 * 1000
                
                existingRequest.name = name
                existingRequest.email = email
                existingRequest.phone = phone
                existingRequest.nationalID = nationalID
                existingRequest.governorate = governorate
                existingRequest.position = position || undefined
                existingRequest.membershipNumber = membershipNumber || undefined
                existingRequest.role = "member"
                existingRequest.notes = notes || undefined
                existingRequest.otpCode = otpCode
                existingRequest.otpExpires = otpExpires
                existingRequest.status = "pending"
                
                await existingRequest.save()

                try {
                    await sendVerificationOtpEmail(email, otpCode)
                } catch (e) {
                    console.error("Email send error", e)
                }

                return res.status(200).json({
                    success: true,
                    message: "تم تحديث الطلب وإرسال كود التحقق (OTP) إلى بريدك الإلكتروني",
                    data: {
                        otpSent: true,
                        email: email
                    },
                })
            }
        }

        // Validate position if provided
        if (position) {
            const validPosition = await Position.findById(position)
            if (!validPosition || !validPosition.isActive) {
                return res.status(400).json({
                    success: false,
                    error: "اللجنة المختارة غير صالحة",
                    data: null,
                })
            }
        }

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
        const otpExpires = Date.now() + 15 * 60 * 1000

        // Create the join request
        const joinRequest = await JoinRequest.create({
            name,
            email,
            phone,
            nationalID,
            governorate,
            position: position || undefined,
            membershipNumber: membershipNumber || undefined,
            role: "member",
            notes: notes || undefined,
            isVerified: false,
            otpCode,
            otpExpires,
        })

        // Send OTP email (non-blocking)
        try {
            await sendVerificationOtpEmail(email, otpCode)
        } catch (e) {
            console.error("Email send error", e)
        }

        res.status(201).json({
            success: true,
            message: "تم إرسال كود التحقق (OTP) إلى بريدك الإلكتروني",
            data: {
                otpSent: true,
                email: email
            },
        })
    } catch (error) {
        console.error("Error creating join request:", error)
        res.status(500).json({
            success: false,
            error: "خطأ في الخادم",
            data: null,
        })
    }
}

// @desc    Get all join requests
// @route   GET /api/v1/join-requests
// @access  Private (Admin only)
const getJoinRequests = async (req, res, next) => {
    try {
        const { status, page = 1, limit = 10 } = req.query
        const search = Filter(req)
        // Build filter object
        const filter = { ...search,}
        if (status && ["pending", "approved", "denied"].includes(status)) {
            filter.status = status
        }

        // Calculate pagination
        const skip = (page - 1) * limit
        const total = await JoinRequest.countDocuments(filter)

        // Get join requests with pagination
        const joinRequests = await JoinRequest.find(filter)
            .populate("position")
            .populate("reviewedBy", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))

        res.status(200).json({
            success: true,
            message: "تم استرجاع طلبات الانضمام بنجاح",
            data: {
                joinRequests,
                pagination: {
                    current: parseInt(page),
                    total: Math.ceil(total / limit),
                    count: joinRequests.length,
                    totalCount: total,
                },
            },
        })
    } catch (error) {
        console.error("Error getting join requests:", error)
        res.status(500).json({
            success: false,
            error: "خطأ في الخادم",
            data: null,
        })
    }
}

// @desc    Get a single join request
// @route   GET /api/v1/join-requests/:id
// @access  Private (Admin only)
const getJoinRequest = async (req, res, next) => {
    try {
        const joinRequest = await JoinRequest.findById(req.params.id).populate("position").populate("reviewedBy", "name email")

        if (!joinRequest) {
            return res.status(404).json({
                success: false,
                error: "طلب الانضمام غير موجود",
                data: null,
            })
        }

        res.status(200).json({
            success: true,
            message: "تم استرجاع طلب الانضمام بنجاح",
            data: {
                joinRequest,
            },
        })
    } catch (error) {
        console.error("Error getting join request:", error)
        res.status(500).json({
            success: false,
            error: "خطأ في الخادم",
            data: null,
        })
    }
}

// @desc    Approve a join request and create user account
// @route   PATCH /api/v1/join-requests/:id/approve
// @access  Private (Admin only)
const approveJoinRequest = async (req, res, next) => {
    try {
        const { notes, university, membershipExpiry } = req.body

        const joinRequest = await JoinRequest.findById(req.params.id).populate("position")

        if (!joinRequest) {
            return res.status(404).json({
                success: false,
                error: "طلب الانضمام غير موجود",
                data: null,
            })
        }

        if (joinRequest.status !== "pending") {
            return res.status(400).json({
                success: false,
                error: "طلب الانضمام تم معالجته بالفعل",
                data: null,
            })
        }

        // Check if user already exists (double-check)
        const existingUser = await User.findOne({
            $or: [{ email: joinRequest.email }, { nationalId: joinRequest.nationalID }],
        })

        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: "المستخدم موجود بالفعل بهذا البريد الإلكتروني أو الرقم القومي",
                data: null,
            })
        }

        // Generate a temporary password (user should change it on first login)
        const tempPassword = Math.random().toString(36).slice(-8) + "A1!"

        // Create user account
        const user = await User.create({
            name: joinRequest.name,
            email: joinRequest.email,
            password: tempPassword,
            phone: joinRequest.phone,
            university: university || "Not specified",
            nationalId: joinRequest.nationalID,
            governorate: joinRequest.governorate,
            position: joinRequest.position,
            membershipNumber: joinRequest.membershipNumber,
            membershipExpiry: membershipExpiry || undefined,
            role: joinRequest.role,
        })

        // Approve the join request
        await joinRequest.approve(req.user._id, notes)

        // Generate token for the new user
        const token = generateToken(user._id)

        // Send approval email with temp password (non-blocking)
        try {
            sendJoinRequestApproved(joinRequest.email, joinRequest.name, tempPassword)
        } catch (e) {
            /* ignore */
        }

        res.status(200).json({
            success: true,
            message: "تم الموافقة على طلب الانضمام وإنشاء حساب المستخدم بنجاح",
            data: {
                joinRequest,
                user,
                tempPassword, // In production, send this via email instead
                token,
            },
        })
    } catch (error) {
        console.error("خطأ في الموافقة على طلب الانضمام:", error)
        res.status(500).json({
            success: false,
            error: "Server Error",
            data: null,
        })
    }
}

// @desc    Deny a join request
// @route   PATCH /api/v1/join-requests/:id/deny
// @access  Private (Admin only)
const denyJoinRequest = async (req, res, next) => {
    try {
        const { notes } = req.body

        const joinRequest = await JoinRequest.findById(req.params.id)

        if (!joinRequest) {
            return res.status(404).json({
                success: false,
                error: "Join request not found",
                data: null,
            })
        }

        if (joinRequest.status !== "pending") {
            return res.status(400).json({
                success: false,
                error: "Join request has already been processed",
                data: null,
            })
        }

        // Deny the join request
        await joinRequest.deny(req.user._id, notes)

        // Send denial email (non-blocking)
        try {
            sendJoinRequestDenied(joinRequest.email, joinRequest.name, notes)
        } catch (e) {
            /* ignore */
        }

        res.status(200).json({
            success: true,
            message: "Join request denied successfully",
            data: {
                joinRequest,
            },
        })
    } catch (error) {
        console.error("Error denying join request:", error)
        res.status(500).json({
            success: false,
            error: "Server Error",
            data: null,
        })
    }
}

// @desc    Delete a join request
// @route   DELETE /api/v1/join-requests/:id
// @access  Private (Admin only)
const deleteJoinRequest = async (req, res, next) => {
    try {
        const joinRequest = await JoinRequest.findById(req.params.id)

        if (!joinRequest) {
            return res.status(404).json({
                success: false,
                error: "Join request not found",
                data: null,
            })
        }

        await JoinRequest.findByIdAndDelete(req.params.id)

        res.status(200).json({
            success: true,
            message: "Join request deleted successfully",
            data: null,
        })
    } catch (error) {
        console.error("Error deleting join request:", error)
        res.status(500).json({
            success: false,
            error: "Server Error",
            data: null,
        })
    }
}

// @desc    Verify OTP for join request
// @route   POST /api/v1/join-requests/verify-otp
// @access  Public
const verifyOtp = async (req, res, next) => {
    try {
        const { email, otpCode } = req.body

        if (!email || !otpCode) {
            return res.status(400).json({
                success: false,
                error: "يرجى تقديم البريد الإلكتروني وكود التحقق",
                data: null,
            })
        }

        const joinRequest = await JoinRequest.findOne({ email })

        if (!joinRequest) {
            return res.status(404).json({
                success: false,
                error: "لم يتم العثور على طلب انضمام بهذا البريد الإلكتروني",
                data: null,
            })
        }

        if (joinRequest.isVerified) {
            return res.status(400).json({
                success: false,
                error: "هذا الحساب تم تفعيله مسبقاً",
                data: null,
            })
        }

        if (joinRequest.otpCode !== otpCode || new Date() > joinRequest.otpExpires) {
            return res.status(400).json({
                success: false,
                error: "كود التحقق غير صحيح أو منتهي الصلاحية",
                data: null,
            })
        }

        joinRequest.isVerified = true
        joinRequest.otpCode = undefined
        joinRequest.otpExpires = undefined
        await joinRequest.save()

        // Send submission confirmation email
        try {
            await sendJoinRequestSubmitted(email, joinRequest.name)
        } catch (e) {
            /* ignore */
        }

        res.status(200).json({
            success: true,
            message: "تم التحقق من البريد الإلكتروني بنجاح وطلبك الآن قيد المراجعة",
            data: null,
        })
    } catch (error) {
        console.error("Error verifying OTP:", error)
        res.status(500).json({
            success: false,
            error: "خطأ في الخادم",
            data: null,
        })
    }
}

// @desc    Resend OTP for join request
// @route   POST /api/v1/join-requests/resend-otp
// @access  Public
const resendOtp = async (req, res, next) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({
                success: false,
                error: "يرجى تقديم البريد الإلكتروني",
                data: null,
            })
        }

        const joinRequest = await JoinRequest.findOne({ email })

        if (!joinRequest) {
            return res.status(404).json({
                success: false,
                error: "لم يتم العثور على طلب انضمام بهذا البريد الإلكتروني",
                data: null,
            })
        }

        if (joinRequest.isVerified) {
            return res.status(400).json({
                success: false,
                error: "هذا الحساب تم تفعيله مسبقاً",
                data: null,
            })
        }

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
        const otpExpires = Date.now() + 15 * 60 * 1000

        joinRequest.otpCode = otpCode
        joinRequest.otpExpires = otpExpires
        await joinRequest.save()

        try {
            await sendVerificationOtpEmail(email, otpCode)
        } catch (e) {
            console.error("Email send error", e)
        }

        res.status(200).json({
            success: true,
            message: "تم إعادة إرسال كود التحقق بنجاح",
            data: null,
        })
    } catch (error) {
        console.error("Error resending OTP:", error)
        res.status(500).json({
            success: false,
            error: "خطأ في الخادم",
            data: null,
        })
    }
}

module.exports = {
    createJoinRequest,
    getJoinRequests,
    getJoinRequest,
    approveJoinRequest,
    denyJoinRequest,
    deleteJoinRequest,
    verifyOtp,
    resendOtp,
}