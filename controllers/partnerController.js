const Partner = require("../models/Partner")

// @desc    Get all partners
// @route   GET /api/v1/partners
// @access  Public
exports.getPartners = async (req, res) => {
    try {
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
    } catch (error) {
        console.error("Get partners error:", error)
        res.status(500).json({
            success: false,
            message: "Failed to fetch partners",
            error: error.message,
        })
    }
}

// @desc    Create new partner
// @route   POST /api/v1/partners
// @access  Private (Admin only)
exports.createPartner = async (req, res) => {
    try {
        const { name, category, websiteUrl, isActive } = req.body

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Name is required",
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
                success: false,
                message: "Logo is required",
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
            message: "Partner created successfully",
            data: partner,
        })
    } catch (error) {
        console.error("Create partner error:", error)
        res.status(500).json({
            success: false,
            message: "Failed to create partner",
            error: error.message,
        })
    }
}

// @desc    Update partner
// @route   PUT /api/v1/partners/:id
// @access  Private (Admin only)
exports.updatePartner = async (req, res) => {
    try {
        const { name, category, websiteUrl, isActive } = req.body

        let partner = await Partner.findById(req.params.id)

        if (!partner) {
            return res.status(404).json({
                success: false,
                message: "Partner not found",
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
            message: "Partner updated successfully",
            data: partner,
        })
    } catch (error) {
        console.error("Update partner error:", error)
        res.status(500).json({
            success: false,
            message: "Failed to update partner",
            error: error.message,
        })
    }
}

// @desc    Delete partner
// @route   DELETE /api/v1/partners/:id
// @access  Private (Admin only)
exports.deletePartner = async (req, res) => {
    try {
        const partner = await Partner.findById(req.params.id)

        if (!partner) {
            return res.status(404).json({
                success: false,
                message: "Partner not found",
            })
        }

        await partner.deleteOne()

        res.status(200).json({
            success: true,
            message: "Partner deleted successfully",
            data: {},
        })
    } catch (error) {
        console.error("Delete partner error:", error)
        res.status(500).json({
            success: false,
            message: "Failed to delete partner",
            error: error.message,
        })
    }
}
