const Job = require("../models/Job");
const { sendToTopic } = require("../utils/firebase");
const asyncHandler = require("../middleware/asyncHandler")
// @desc    Get all jobs
// @route   GET /api/v1/jobs-and-internships
// @access  Public
exports.getJobs = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let filter = {};

    // Support optional filtering via query parameter
    if (req.query.category) {
        filter.category = req.query.category;
    }

    const jobs = await Job.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Job.countDocuments(filter);

    res.status(200).json({
        success: true,
        count: jobs.length,
        data: {
            jobs,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            }
        }
    });
};
// @desc    Get single news by ID
// @route   GET /api/v1/jobs-and-internships/:id
// @access  Public
exports.getJobById = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    let query = { slug: id }
    if (mongoose.Types.ObjectId.isValid(id)) {
        query = { $or: [{ slug: id }, { _id: id }] }
    }
    const job = await Job.findOne(query)
    if (!job) {
        return res.status(404).json({
            status: 'error',
            message: "لم يتم العثور على الخبر"
        })
    }
    res.status(200).json({
        success: true,
        data: job
    })
})
// @desc    Create new job
// @route   POST /api/v1/jobs-and-internships
// @access  Private (Admin)
exports.createJob = async (req, res) => {
    const { title, description, category, sendNotification } = req.body;

    // Check if image was uploaded
    if (!req.file) {
        return res.status(400).json({
            success: false,
            error: "Please upload an image for the job"
        });
    }

    const jobData = {
        title,
        description,
        category,
        imageUrl: `/uploads/${req.file.filename}`
    };

    const job = await Job.create(jobData);

    // Optionally trigger Firebase notification
    // Note: the boolean flag might be a string "true" from form-data
    const shouldNotify = sendNotification === true || sendNotification === "true";
    if (shouldNotify) {
        try {
            await sendToTopic(
                "update",
                `New ${category} available!`,
                title,
                { type: "jobs", id: job._id.toString() }
            );
        } catch (error) {
            console.error("Failed to send Firebase notification:", error.message);
            // We don't fail the job creation if notification fails, but log it.
        }
    }

    res.status(201).json({
        success: true,
        data: job
    });
};

// @desc    Update job
// @route   PUT /api/v1/jobs-and-internships/:id
// @access  Private (Admin)
exports.updateJob = async (req, res) => {
    let job = await Job.findById(req.params.id);

    if (!job) {
        return res.status(404).json({
            success: false,
            error: `Job not found with id of ${req.params.id}`
        });
    }

    const updateData = { ...req.body };

    // Handle new image upload
    if (req.file) {
        updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    job = await Job.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: job
    });
};

// @desc    Delete job
// @route   DELETE /api/v1/jobs-and-internships/:id
// @access  Private (Admin)
exports.deleteJob = async (req, res) => {
    const job = await Job.findById(req.params.id);

    if (!job) {
        return res.status(404).json({
            success: false,
            error: `Job not found with id of ${req.params.id}`
        });
    }

    await job.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
};
