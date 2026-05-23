const JoinRequest = require("../models/JoinRequest")
const User = require("../models/User")
const Position = require("../models/Position")
const SiteSettings = require("../models/SiteSettings")
const { generateToken } = require("../middleware/auth")
const { sendJoinRequestSubmitted, sendJoinRequestApproved, sendJoinRequestDenied } = require("../utils/email")
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
            status: 'error',
            message: settings.joinRequestMessage || "Join requests are currently disabled"
        })
        }

        const { name, email, phone, nationalID, governorate, position, membershipNumber, notes } = req.body

        // Validate required fields
        if (!name || !email || !phone || !nationalID || !governorate) {
            return res.status(400).json({
            status: 'error',
            message: "الاسم، البريد الإلكتروني، الهاتف، الرقم القومي، المحافظة والدور مطلوبة"
        })
        }

        // Check if user already exists with this email or nationalID
        const existingUser = await User.findOne({
            $or: [{ email }, { nationalId: nationalID }],
        })

        if (existingUser) {
            return res.status(400).json({
            status: 'error',
            message: "المستخدم مسجل بالفعل بهذا البريد الإلكتروني أو الرقم القومي"
        })
        }

        // Check if there's already a pending request with this email or nationalID
        const existingRequest = await JoinRequest.findOne({
            $or: [{ email }, { nationalID }],
            status: "pending",
        })

        if (existingRequest) {
            return res.status(400).json({
            status: 'error',
            message: "هناك طلب انضمام معلق بالفعل لهذا البريد الإلكتروني أو الرقم القومي"
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

        // Validate role

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
        })

        // Populate position if it exists
        await joinRequest.populate("position")

        // Send submission confirmation email (non-blocking)
        try {
            sendJoinRequestSubmitted(email, name)
        } catch (e) {
            /* ignore */
        }

        res.status(201).json({
            status: 'error',
            message: "حدث خطأ في الخادم"
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
        const filter = {}
        if (status && ["pending", "approved", "denied"].includes(status)) {
            filter.status = status
        }

        // Calculate pagination
        const skip = (page - 1) * limit
        const total = await JoinRequest.countDocuments(search)

        // Get join requests with pagination
        const joinRequests = await JoinRequest.find()
            .where(search)
            .populate("position")
            .populate("reviewedBy", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))

        res.status(200).json({
            status: 'error',
            message: "حدث خطأ في الخادم"
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
            status: 'error',
            message: "لم يتم العثور على طلب الانضمام"
        })
        }

        res.status(200).json({
            status: 'error',
            message: "حدث خطأ في الخادم"
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
            status: 'error',
            message: "لم يتم العثور على طلب الانضمام"
        })
        }

        if (joinRequest.status !== "pending") {
            return res.status(400).json({
            status: 'error',
            message: "تمت معالجة طلب الانضمام بالفعل"
        })
        }

        // Check if user already exists (double-check)
        const existingUser = await User.findOne({
            $or: [{ email: joinRequest.email }, { nationalId: joinRequest.nationalID }],
        })

        if (existingUser) {
            return res.status(400).json({
            status: 'error',
            message: "المستخدم مسجل بالفعل بهذا البريد الإلكتروني أو الرقم القومي"
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
            status: 'error',
            message: "حدث خطأ في الخادم"
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
            status: 'error',
            message: "لم يتم العثور على طلب الانضمام"
        })
        }

        if (joinRequest.status !== "pending") {
            return res.status(400).json({
            status: 'error',
            message: "تمت معالجة طلب الانضمام بالفعل"
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
            status: 'error',
            message: "حدث خطأ في الخادم"
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
            status: 'error',
            message: "لم يتم العثور على طلب الانضمام"
        })
        }

        await JoinRequest.findByIdAndDelete(req.params.id)

        res.status(200).json({
            status: 'error',
            message: "حدث خطأ في الخادم"
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
}
