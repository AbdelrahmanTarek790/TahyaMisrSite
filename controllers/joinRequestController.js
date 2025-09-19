const JoinRequest = require("../models/JoinRequest")
const User = require("../models/User")
const Position = require("../models/Position")
const { generateToken } = require("../middleware/auth")

// @desc    Create a new join request
// @route   POST /api/v1/join-requests
// @access  Public
const createJoinRequest = async (req, res, next) => {
    try {
        const { name, email, phone, nationalID, governorate, position, membershipNumber, role, notes } = req.body

        // Validate required fields
        if (!name || !email || !phone || !nationalID || !governorate || !role) {
            return res.status(400).json({
                success: false,
                error: "Name, email, phone, nationalID, governorate, and role are required",
                data: null,
            })
        }

        // Check if user already exists with this email or nationalID
        const existingUser = await User.findOne({
            $or: [{ email }, { nationalId: nationalID }],
        })

        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: "User already exists with this email or national ID",
                data: null,
            })
        }

        // Check if there's already a pending request with this email or nationalID
        const existingRequest = await JoinRequest.findOne({
            $or: [{ email }, { nationalID }],
            status: "pending",
        })

        if (existingRequest) {
            return res.status(400).json({
                success: false,
                error: "A join request is already pending for this email or national ID",
                data: null,
            })
        }

        // Validate position if provided
        if (position) {
            const validPosition = await Position.findById(position)
            if (!validPosition || !validPosition.isActive) {
                return res.status(400).json({
                    success: false,
                    error: "Invalid position selected",
                    data: null,
                })
            }
        }

        // Validate role
        if (!["member", "volunteer"].includes(role)) {
            return res.status(400).json({
                success: false,
                error: "Role must be either 'member' or 'volunteer'",
                data: null,
            })
        }

        // Create the join request
        const joinRequest = await JoinRequest.create({
            name,
            email,
            phone,
            nationalID,
            governorate,
            position: position || undefined,
            membershipNumber: membershipNumber || undefined,
            role,
            notes: notes || undefined,
        })

        // Populate position if it exists
        await joinRequest.populate("position")

        res.status(201).json({
            success: true,
            message: "Join request submitted successfully",
            data: {
                joinRequest,
            },
        })
    } catch (error) {
        console.error("Error creating join request:", error)
        res.status(500).json({
            success: false,
            error: "Server Error",
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

        // Build filter object
        const filter = {}
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
            message: "Join requests retrieved successfully",
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
            error: "Server Error",
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
                error: "Join request not found",
                data: null,
            })
        }

        res.status(200).json({
            success: true,
            message: "Join request retrieved successfully",
            data: {
                joinRequest,
            },
        })
    } catch (error) {
        console.error("Error getting join request:", error)
        res.status(500).json({
            success: false,
            error: "Server Error",
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

        // Check if user already exists (double-check)
        const existingUser = await User.findOne({
            $or: [{ email: joinRequest.email }, { nationalId: joinRequest.nationalID }],
        })

        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: "User already exists with this email or national ID",
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

        res.status(200).json({
            success: true,
            message: "Join request approved and user account created successfully",
            data: {
                joinRequest,
                user,
                tempPassword, // In production, send this via email instead
                token,
            },
        })
    } catch (error) {
        console.error("Error approving join request:", error)
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

module.exports = {
    createJoinRequest,
    getJoinRequests,
    getJoinRequest,
    approveJoinRequest,
    denyJoinRequest,
    deleteJoinRequest,
}
