const News = require("../models/News")
const { sendToTopic } = require("../utils/firebase")
const {newsSchema, arabicJoiMessages} = require("../utils/validation")
const path = require("path")
const fs = require("fs")
const mongoose = require("mongoose")
const { Filter } = require("../utils/Filter")
const asyncHandler = require("../middleware/asyncHandler")

// @desc    Get all news
// @route   GET /api/v1/news
// @access  Public
const getNews = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit
    const search = Filter(req)
    const news = await News.find().where(search).populate("createdBy", "name email").skip(skip).limit(limit).sort({ createdAt: -1 })

    const total = await News.countDocuments(search)

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
    })
})

// @desc    Get single news by ID
// @route   GET /api/v1/news/:id
// @access  Public
const getNewsById = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    let query = { slug: id }
    if (mongoose.Types.ObjectId.isValid(id)) {
        query = { $or: [{ slug: id }, { _id: id }] }
    }
    const news = await News.findOne(query).populate("createdBy", "name email")
    if (!news) {
        return res.status(404).json({
            status: 'error',
            message: "لم يتم العثور على الخبر"
        })
    }
    res.status(200).json({
        success: true,
        data: news
    })
})

// @desc    Create new news
// @route   POST /api/v1/news
// @access  Private/Admin
const createNews = asyncHandler(async (req, res, next) => {
    // Validate input
    const { error } = newsSchema.validate(req.body, { messages: arabicJoiMessages })
    if (error) {
        return res.status(400).json({
            status: 'error',
            message: error.details[0].message
        })
    }

    req.body.createdBy = req.user.id

    if (req.file) {
        req.body.image = req.file.filename
    }

    const news = await News.create(req.body)
    const populatedNews = await News.findById(news._id).populate("createdBy", "name email")

    const shouldNotify = req.body.sendNotification === true || req.body.sendNotification === "true";
    if (shouldNotify) {
        try {
            await sendToTopic(
                "update",
                "خبر جديد!",
                req.body.title,
                { type: "news", id: news._id.toString() }
            );
        } catch (error) {
            console.error("Failed to send Firebase notification:", error.message);
        }
    }

    res.status(201).json({
        success: true,
        data: populatedNews
    })
})

// @desc    Update news
// @route   PUT /api/v1/news/:id
// @access  Private/Admin
const updateNews = asyncHandler(async (req, res, next) => {
    const existingNews = await News.findById(req.params.id)

    if (!existingNews) {
        return res.status(404).json({
            status: 'error',
            message: "لم يتم العثور على الخبر"
        })
    }

    if (req.file) {
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
        data: news
    })
})

// @desc    Delete news
// @route   DELETE /api/v1/news/:id
// @access  Private/Admin
const deleteNews = asyncHandler(async (req, res, next) => {
    const news = await News.findById(req.params.id)

    if (!news) {
        return res.status(404).json({
            status: 'error',
            message: "لم يتم العثور على الخبر"
        })
    }

    if (news.image) {
        const imagePath = path.join(process.env.UPLOAD_PATH || "./uploads", news.image)
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath)
        }
    }

    await News.findByIdAndDelete(req.params.id)

    res.status(200).json({
        success: true,
        message: "تم حذف الخبر بنجاح"
    })
})

module.exports = {
    getNews,
    getNewsById,
    createNews,
    updateNews,
    deleteNews,
}
