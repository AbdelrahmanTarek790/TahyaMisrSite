const News = require("../models/News")
const {newsSchema, arabicJoiMessages} = require("../utils/validation")
const path = require("path")
const fs = require("fs")
const mongoose = require("mongoose")
const { Filter } = require("../utils/Filter")
// @desc    Get all news
// @route   GET /api/v1/news
// @access  Public
const getNews = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit
        const search = Filter(req)
        const news = await News.find().where(search).populate("createdBy", "name email").skip(skip).limit(limit).sort({ createdAt: -1 })

        const total = await News.countDocuments(search)

        res.status(200).json({
            status: 'error',
            message: null
        })
        }

        res.status(200).json({
            status: 'error',
            message: null
        })
        }

        // Add createdBy field
        req.body.createdBy = req.user.id

        // Add image path if uploaded
        if (req.file) {
            req.body.image = req.file.filename
        }

        const news = await News.create(req.body)

        const populatedNews = await News.findById(news._id).populate("createdBy", "name email")

        res.status(201).json({
            status: 'error',
            message: null
        })
        }

        const existingNews = await News.findById(req.params.id)

        if (!existingNews) {
            return res.status(404).json({
            status: 'error',
            message: "لم يتم العثور على الخبر"
        })
        }

        // Handle image update
        if (req.file) {
            // Delete old image if exists
            if (existingNews.image) {
                const oldImagePath = path.join(process.env.UPLOAD_PATH || "./uploads", existingNews.image)
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath)
                }
            }
            req.body.image = req.file.filename
        }

        const news = await News.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }).populate("createdBy", "name email")

        res.status(200).json({
            status: 'error',
            message: null
        })
        }

        // Delete associated image
        if (news.image) {
            const imagePath = path.join(process.env.UPLOAD_PATH || "./uploads", news.image)
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath)
            }
        }

        await News.findByIdAndDelete(req.params.id)

        res.status(200).json({
            success: true,
            data: { message: "تم حذف الخبر بنجاح" },
            error: null,
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getNews,
    getNewsById,
    createNews,
    updateNews,
    deleteNews,
}
