const path = require("path")
const fs = require("fs")
const HeroImage = require("../models/HeroImage")

// GET /api/v1/hero-images
const listHeroImages = async (req, res, next) => {
    try {
        const images = await HeroImage.find({ isActive: true }).sort({ order: 1, createdAt: -1 })
        res.status(200).json({ success: true, data: images, error: null })
    } catch (err) {
        next(err)
    }
}

const listHeroImagesAdmin = async (req, res, next) => {
    try {
        const images = await HeroImage.find().sort({ order: 1, createdAt: -1 })
        res.status(200).json({ success: true, data: images, error: null })
    } catch (err) {
        next(err)
    }
}

// POST /api/v1/hero-images
const createHeroImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: "No file uploaded", data: null })
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
        res.status(201).json({ success: true, data: doc, error: null })
    } catch (err) {
        if (req.file) {
            const filePath = path.join(process.env.UPLOAD_PATH || "./uploads", req.file.filename)
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
        }
        next(err)
    }
}

// PUT /api/v1/hero-images/:id
const updateHeroImage = async (req, res, next) => {
    try {
        const { title, description, order, isActive } = req.body
        const updates = {}
        if (title !== undefined) updates.title = title
        if (description !== undefined) updates.description = description
        if (order !== undefined) updates.order = Number(order) || 0
        if (isActive !== undefined) updates.isActive = isActive === "false" ? false : true

        const doc = await HeroImage.findByIdAndUpdate(req.params.id, updates, { new: true })
        if (!doc) return res.status(404).json({ success: false, error: "Hero image not found", data: null })
        res.status(200).json({ success: true, data: doc, error: null })
    } catch (err) {
        next(err)
    }
}

// DELETE /api/v1/hero-images/:id
const deleteHeroImage = async (req, res, next) => {
    try {
        const doc = await HeroImage.findById(req.params.id)
        if (!doc) return res.status(404).json({ success: false, error: "Hero image not found", data: null })

        const filePath = path.join(process.env.UPLOAD_PATH || "./uploads", doc.imagePath)
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath)

        await HeroImage.findByIdAndDelete(req.params.id)
        res.status(200).json({ success: true, data: { message: "Deleted" }, error: null })
    } catch (err) {
        next(err)
    }
}

module.exports = { listHeroImages, createHeroImage, updateHeroImage, deleteHeroImage, listHeroImagesAdmin }
