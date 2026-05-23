const path = require("path")
const fs = require("fs")
const HeroImage = require("../models/HeroImage")

// GET /api/v1/hero-images
const listHeroImages = async (req, res, next) => {
    try {
        const images = await HeroImage.find({ isActive: true }).sort({ order: 1, createdAt: -1 })
        res.status(200).json({
            status: 'error',
            message: null })
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
            status: 'error',
            message: null })
        })
        res.status(200).json({
            status: 'error',
            message: null })
        })

        const filePath = path.join(process.env.UPLOAD_PATH || "./uploads", doc.imagePath)
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath)

        await HeroImage.findByIdAndDelete(req.params.id)
        res.status(200).json({ success: true, data: { message: "تم الحذف بنجاح" }, error: null })
    } catch (err) {
        next(err)
    }
}

module.exports = { listHeroImages, createHeroImage, updateHeroImage, deleteHeroImage, listHeroImagesAdmin }
