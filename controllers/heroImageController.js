const path = require("path")
const fs = require("fs")
const HeroImage = require("../models/HeroImage")
const asyncHandler = require("../middleware/asyncHandler")

// GET /api/v1/hero-images
// Public: list active hero images
const listHeroImages = asyncHandler(async (req, res, next) => {
    const images = await HeroImage.find({ isActive: true }).sort({ order: 1, createdAt: -1 })
    res.status(200).json({
        success: true,
        data: images
    })
})

// POST /api/v1/hero-images
// Admin only: create hero image
const createHeroImage = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({
            status: 'error',
            message: "الرجاء رفع ملف الصورة"
        })
    }
    const { title, description, order = 0, isActive = true } = req.body
    const doc = await HeroImage.create({
        title,
        description,
        imagePath: req.file.filename,
        order: Number(order) || 0,
        isActive: isActive === "false" ? false : true,
        createdBy: req.user.id,
    })
    res.status(201).json({
        success: true,
        data: doc
    })
})

// GET /api/v1/hero-images/admin
// Admin only: list all hero images
const listHeroImagesAdmin = asyncHandler(async (req, res, next) => {
    const images = await HeroImage.find().sort({ order: 1, createdAt: -1 })
    res.status(200).json({
        success: true,
        data: images
    })
})

// PUT /api/v1/hero-images/:id
// Admin only: update hero image
const updateHeroImage = asyncHandler(async (req, res, next) => {
    const { title, description, order, isActive } = req.body
    const doc = await HeroImage.findById(req.params.id)
    if (!doc) {
        return res.status(404).json({
            status: 'error',
            message: "لم يتم العثور على الصورة"
        })
    }
    if (req.file) {
        const oldFilePath = path.join(process.env.UPLOAD_PATH || "./uploads", doc.imagePath)
        if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath)
        doc.imagePath = req.file.filename
    }
    if (title !== undefined) doc.title = title
    if (description !== undefined) doc.description = description
    if (order !== undefined) doc.order = Number(order) || 0
    if (isActive !== undefined) doc.isActive = isActive === "false" ? false : true

    await doc.save()
    res.status(200).json({
        success: true,
        data: doc
    })
})

// DELETE /api/v1/hero-images/:id
// Admin only: delete hero image
const deleteHeroImage = asyncHandler(async (req, res, next) => {
    const doc = await HeroImage.findById(req.params.id)
    if (!doc) {
        return res.status(404).json({
            status: 'error',
            message: "لم يتم العثور على الصورة"
        })
    }
    const filePath = path.join(process.env.UPLOAD_PATH || "./uploads", doc.imagePath)
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)

    await doc.deleteOne()
    res.status(200).json({
        success: true,
        data: { message: "تم الحذف بنجاح" }
    })
})

module.exports = {
    listHeroImages,
    createHeroImage,
    updateHeroImage,
    deleteHeroImage,
    listHeroImagesAdmin,
}
