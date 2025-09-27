const News = require("../models/News")
const { newsSchema } = require("../utils/validation")
const path = require("path")
const fs = require("fs")
const mongoose = require("mongoose")
// @desc    Get all news
// @route   GET /api/v1/news
// @access  Public
const getNews = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit

        const news = await News.find().populate("createdBy", "name email").skip(skip).limit(limit).sort({ createdAt: -1 })

        const total = await News.countDocuments()

        res.status(200).json({
            success: true,
            data: {
                news,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit),
                },
            },
            error: null,
        })
    } catch (error) {
        next(error)
    }
}

// @desc    Get single news
// @route   GET /api/v1/news/:id
// @access  Public
const getNewsById = async (req, res, next) => {
    try {
        const { id } = req.params
        let query = { slug: id }
        if (mongoose.Types.ObjectId.isValid(id)) {
            query = { $or: [{ slug: id }, { _id: id }] }
        }

        const news = await News.findOne(query).populate("createdBy", "name email")

        if (!news) {
            return res.status(404).json({
                success: false,
                error: "News not found",
                data: null,
            })
        }

        res.status(200).json({
            success: true,
            data: news,
            error: null,
        })
    } catch (error) {
        next(error)
    }
}

// @desc    Create news
// @route   POST /api/v1/news
// @access  Private/Admin
const createNews = async (req, res, next) => {
    try {
        // Validate input
        const { error } = newsSchema.validate(req.body)
        if (error) {
            return res.status(400).json({
                success: false,
                error: error.details[0].message,
                data: null,
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
            success: true,
            data: populatedNews,
            error: null,
        })
    } catch (error) {
        next(error)
    }
}

// @desc    Update news
// @route   PUT /api/v1/news/:id
// @access  Private/Admin
const updateNews = async (req, res, next) => {
    try {
        // Validate input
        const { error } = newsSchema.validate(req.body)
        if (error) {
            return res.status(400).json({
                success: false,
                error: error.details[0].message,
                data: null,
            })
        }

        const existingNews = await News.findById(req.params.id)

        if (!existingNews) {
            return res.status(404).json({
                success: false,
                error: "News not found",
                data: null,
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
            success: true,
            data: news,
            error: null,
        })
    } catch (error) {
        next(error)
    }
}

// @desc    Delete news
// @route   DELETE /api/v1/news/:id
// @access  Private/Admin
const deleteNews = async (req, res, next) => {
    try {
        const news = await News.findById(req.params.id)

        if (!news) {
            return res.status(404).json({
                success: false,
                error: "News not found",
                data: null,
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
            data: { message: "News deleted successfully" },
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
