const Privilege = require("../models/Privilege")
const asyncHandler = require("../middleware/asyncHandler")

// @desc    Get all privileges
// @route   GET /api/v1/privileges
// @access  Public
exports.getPrivileges = asyncHandler(async (req, res, next) => {
    const { isActive, type } = req.query
    const filter = {}
    if (isActive !== undefined) filter.isActive = isActive === "true"
    if (type) filter.type = type

    const privileges = await Privilege.find(filter).sort({ createdAt: -1 })

    res.status(200).json({
        success: true,
        data: privileges
    })
})

// @desc    Create new privilege
// @route   POST /api/v1/privileges
// @access  Private (Admin only)
exports.createPrivilege = asyncHandler(async (req, res, next) => {
    const { partnerName, description, privileges, contactInfo, address, type, isActive } = req.body

    if (!partnerName || !type) {
        return res.status(400).json({
            status: 'error',
            message: "اسم الشريك ونوع الامتياز مطلوبان"
        })
    }

    // Handle logo upload
    let logoPath = null
    if (req.file) {
        logoPath = `/uploads/${req.file.filename}`
    } else if (req.body.logo) {
        logoPath = req.body.logo
    }

    // Parse privileges if it's a JSON string
    let parsedPrivileges = privileges || []
    if (typeof privileges === "string") {
        try {
            parsedPrivileges = JSON.parse(privileges)
        } catch (e) {
            parsedPrivileges = []
        }
    }

    const privilege = await Privilege.create({
        partnerName,
        logo: logoPath,
        description,
        privileges: parsedPrivileges,
        contactInfo,
        address,
        type,
        isActive: isActive !== undefined ? isActive : true,
        createdBy: req.user._id,
    })

    res.status(201).json({
        success: true,
        message: "تم إنشاء الامتياز بنجاح",
        data: privilege
    })
})

// @desc    Update privilege
// @route   PUT /api/v1/privileges/:id
// @access  Private (Admin only)
exports.updatePrivilege = asyncHandler(async (req, res, next) => {
    const { partnerName, description, privileges, contactInfo, address, type, isActive } = req.body

    let privilege = await Privilege.findById(req.params.id)

    if (!privilege) {
        return res.status(404).json({
            status: 'error',
            message: "لم يتم العثور على الامتياز"
        })
    }

    // Handle logo upload
    if (req.file) {
        privilege.logo = `/uploads/${req.file.filename}`
    } else if (req.body.logo !== undefined) {
        privilege.logo = req.body.logo
    }

    // Update fields
    if (partnerName) privilege.partnerName = partnerName
    if (description !== undefined) privilege.description = description
    if (privileges !== undefined) {
        if (typeof privileges === "string") {
            try {
                privilege.privileges = JSON.parse(privileges)
            } catch (e) {
                privilege.privileges = []
            }
        } else {
            privilege.privileges = privileges
        }
    }
    if (contactInfo !== undefined) privilege.contactInfo = contactInfo
    if (address !== undefined) privilege.address = address
    if (type) privilege.type = type
    if (isActive !== undefined) privilege.isActive = isActive

    await privilege.save()

    res.status(200).json({
        success: true,
        message: "تم تحديث الامتياز بنجاح",
        data: privilege
    })
})

// @desc    Delete privilege
// @route   DELETE /api/v1/privileges/:id
// @access  Private (Admin only)
exports.deletePrivilege = asyncHandler(async (req, res, next) => {
    const privilege = await Privilege.findById(req.params.id)

    if (!privilege) {
        return res.status(404).json({
            status: 'error',
            message: "لم يتم العثور على الامتياز"
        })
    }

    await privilege.deleteOne()

    res.status(200).json({
        success: true,
        message: "تم حذف الامتياز بنجاح",
        data: {}
    })
})
