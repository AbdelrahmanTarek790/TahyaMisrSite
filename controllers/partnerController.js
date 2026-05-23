const Partner = require("../models/Partner")
const asyncHandler = require("../middleware/asyncHandler")

// @desc    Get all partners
// @route   GET /api/v1/partners
// @access  Public
exports.getPartners = asyncHandler(async (req, res, next) => {
    const { isActive, category } = req.query
    const filter = {}
    if (isActive !== undefined) filter.isActive = isActive === "true"
    if (category) filter.category = category

    const partners = await Partner.find(filter).sort({ createdAt: -1 })

    res.status(200).json({
        success: true,
        count: partners.length,
        data: partners,
    })
})

// @desc    Create new partner
// @route   POST /api/v1/partners
// @access  Private (Admin only)
exports.createPartner = asyncHandler(async (req, res, next) => {
    const { name, category, websiteUrl, isActive } = req.body

    if (!name) {
        return res.status(400).json({
            status: 'error',
            message: "الاسم مطلوب"
        })
    }

    // Handle logo upload
    let logoPath = null
    if (req.file) {
        logoPath = `/uploads/${req.file.filename}`
    } else if (req.body.logo) {
        logoPath = req.body.logo
    }

    if (!logoPath) {
        return res.status(400).json({
            status: 'error',
            message: "الشعار مطلوب"
        })
    }

    const partner = await Partner.create({
        name,
        logo: logoPath,
        category: category || "sponsor",
        websiteUrl,
        isActive: isActive !== undefined ? isActive : true,
        createdBy: req.user._id,
    })

    res.status(201).json({
        success: true,
        message: "تم إنشاء الشريك بنجاح",
        data: partner
    })
})

// @desc    Update partner
// @route   PUT /api/v1/partners/:id
// @access  Private (Admin only)
exports.updatePartner = asyncHandler(async (req, res, next) => {
    const { name, category, websiteUrl, isActive } = req.body

    let partner = await Partner.findById(req.params.id)

    if (!partner) {
        return res.status(404).json({
            status: 'error',
            message: "لم يتم العثور على الشريك"
        })
    }

    // Handle logo upload
    if (req.file) {
        partner.logo = `/uploads/${req.file.filename}`
    } else if (req.body.logo !== undefined) {
        partner.logo = req.body.logo
    }

    // Update fields
    if (name) partner.name = name
    if (category) partner.category = category
    if (websiteUrl !== undefined) partner.websiteUrl = websiteUrl
    if (isActive !== undefined) partner.isActive = isActive

    await partner.save()

    res.status(200).json({
        success: true,
        message: "تم تحديث الشريك بنجاح",
        data: partner
    })
})

// @desc    Delete partner
// @route   DELETE /api/v1/partners/:id
// @access  Private (Admin only)
exports.deletePartner = asyncHandler(async (req, res, next) => {
    const partner = await Partner.findById(req.params.id)

    if (!partner) {
        return res.status(404).json({
            status: 'error',
            message: "لم يتم العثور على الشريك"
        })
    }

    await partner.deleteOne()

    res.status(200).json({
        success: true,
        message: "تم حذف الشريك بنجاح",
        data: {}
    })
})
