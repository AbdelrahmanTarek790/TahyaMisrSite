const User = require("../models/User")
const { updateUserSchema, arabicJoiMessages } = require("../utils/validation")
const { Filter } = require("../utils/Filter")
const { filterUserFields } = require("../utils/userFieldFilter")
// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit

        // Build query with proper AND/OR logic
        const query = {}
        const conditions = []

        // Handle search (OR logic across multiple fields)
        if (req.query.search && req.query.search.trim()) {
            const searchTerm = req.query.search.trim()
            conditions.push({
                $or: [
                    { name: { $regex: searchTerm, $options: "i" } },
                    { email: { $regex: searchTerm, $options: "i" } },
                    { university: { $regex: searchTerm, $options: "i" } },
                    { governorate: { $regex: searchTerm, $options: "i" } },
                    { nationalId: { $regex: searchTerm, $options: "i" } },
                    { membershipNumber: { $regex: searchTerm, $options: "i" } },
                    { phone: { $regex: searchTerm, $options: "i" } },
                ],
            })
        }

        // Handle exact filters (AND logic)
        if (req.query.role && req.query.role !== "all") {
            conditions.push({ role: req.query.role })
        }
        
        // Enforce governorate for Coordinator
        if (req.user.role === "coordinator") {
            conditions.push({ governorate: req.user.governorate })
        } else if (req.query.governorate && req.query.governorate !== "all") {
            conditions.push({ governorate: req.query.governorate })
        }
        
        if (req.query.university && req.query.university !== "all") {
            conditions.push({ university: req.query.university })
        }

        // Combine all conditions with AND
        if (conditions.length > 0) {
            query.$and = conditions
        }

                const users = await User.find(query)
            .populate("position")
            .populate("customFieldValues.fieldId")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })

        const total = await User.countDocuments(query)
        const filteredUsers = await filterUserFields(req.user, users)

        res.status(200).json({
            status: 'error',
            message: null
        })
        }

        const filteredUser = await filterUserFields(req.user, user)

        res.status(200).json({
            status: 'error',
            message: null
        })
            }
        }

        // Don't allow password updates through this endpoint
        if (req.body.password) {
            delete req.body.password
        }

        // Prepare update data
        const updateData = { ...req.body }

        // Handle profile image upload if provided
        if (req.file) {
            updateData.profileImage = req.file.filename
        }

        const user = await User.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        }).populate("position").populate("customFieldValues.fieldId")

        if (!user) {
            return res.status(404).json({
            status: 'error',
            message: "المستخدم غير موجود"
        })
        }

        const filteredUser = await filterUserFields(req.user, user)

        res.status(200).json({
            status: 'error',
            message: null
        })
        }

        // Don't allow admin to delete themselves
        if (user._id.toString() === req.user.id) {
            return res.status(400).json({
            status: 'error',
            message: "لا يمكنك حذف حسابك الشخصي"
        })
        }

        await User.findByIdAndDelete(req.params.id)

        res.status(200).json({
            success: true,
            data: { message: "تم حذف المستخدم بنجاح" },
            error: null,
        })
    } catch (error) {
        next(error)
    }
}

// @desc    Get user statistics
// @route   GET /api/v1/users/stats
// @access  Private/Admin
const getUserStats = async (req, res, next) => {
    try {
        const filter = {}
        
        // Enforce governorate for Coordinator
        if (req.user.role === "coordinator") {
            filter.governorate = req.user.governorate
        } else if (req.query.governorate && req.query.governorate !== "all") {
            filter.governorate = req.query.governorate
        }

        const totalUsers = await User.countDocuments(filter)
        const members = await User.countDocuments({ ...filter, role: "member" })
        const volunteers = await User.countDocuments({ ...filter, role: "volunteer" })
        const publishers = await User.countDocuments({ ...filter, role: "publisher" })
        const admins = await User.countDocuments({ ...filter, role: "admin" })
        const hr = await User.countDocuments({ ...filter, role: "hr" })
        const partnershipManagers = await User.countDocuments({ ...filter, role: "partnership_manager" })
        const coordinators = await User.countDocuments({ ...filter, role: "coordinator" })

        res.status(200).json({
            success: true,
            data: {
                total: totalUsers,
                members,
                volunteers,
                publishers,
                admins,
                hr,
                partnershipManagers,
                coordinators,
            },
            error: null,
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    getUserStats,
}
