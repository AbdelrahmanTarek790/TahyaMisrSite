const Event = require("../models/Event")
const {eventSchema, guestEventRegistrationSchema, arabicJoiMessages} = require("../utils/validation")
const path = require("path")
const fs = require("fs")
const { Filter } = require("../utils/Filter")
const asyncHandler = require("../middleware/asyncHandler")

// @desc    Get all events
// @route   GET /api/v1/events
// @access  Public
const getEvents = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit
    const search = Filter(req)
    const events = await Event.find()
        .where(search)
        .populate("createdBy", "name")
        .skip(skip)
        .limit(limit)
        .sort({ date: -1 })
    
    const total = await Event.countDocuments(search)

    const safeEvents = events.map((e) => {
        const obj = e.toObject()
        delete obj.guestRegistrations
        delete obj.registeredUsers
        obj.guestRegistrationsCount = (e.guestRegistrations || []).length
        return obj
    })

    res.status(200).json({
        success: true,
        count: safeEvents.length,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        },
        data: safeEvents
    })
})

// @desc    Get event by ID
// @route   GET /api/v1/events/:id
// @access  Public
const getEventById = asyncHandler(async (req, res, next) => {
    const event = await Event.findById(req.params.id)
        .populate("createdBy", "name email")
        .populate("registeredUsers", "name email")

    if (!event) {
        return res.status(404).json({
            status: 'error',
            message: "لم يتم العثور على الفعالية"
        })
    }

    const safeEvent = event.toObject()
    delete safeEvent.guestRegistrations
    safeEvent.guestRegistrationsCount = (event.guestRegistrations || []).length

    res.status(200).json({
        success: true,
        data: safeEvent
    })
})

// @desc    Create new event
// @route   POST /api/v1/events
// @access  Private/Admin
const createEvent = asyncHandler(async (req, res, next) => {
    const { error } = eventSchema.validate(req.body, { messages: arabicJoiMessages })
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

    const event = await Event.create(req.body)
    const populatedEvent = await Event.findById(event._id).populate("createdBy", "name email")

    res.status(201).json({
        success: true,
        data: populatedEvent
    })
})

// @desc    Update event
// @route   PUT /api/v1/events/:id
// @access  Private/Admin
const updateEvent = asyncHandler(async (req, res, next) => {
    const existingEvent = await Event.findById(req.params.id)

    if (!existingEvent) {
        return res.status(404).json({
            status: 'error',
            message: "لم يتم العثور على الفعالية"
        })
    }

    if (req.file) {
        if (existingEvent.image) {
            const oldImagePath = path.join(process.env.UPLOAD_PATH || "./uploads", existingEvent.image)
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath)
            }
        }
        req.body.image = req.file.filename
    }

    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    })
        .populate("createdBy", "name email")
        .populate("registeredUsers", "name email")

    res.status(200).json({
        success: true,
        data: event
    })
})

// @desc    Delete event
// @route   DELETE /api/v1/events/:id
// @access  Private/Admin
const deleteEvent = asyncHandler(async (req, res, next) => {
    const event = await Event.findById(req.params.id)

    if (!event) {
        return res.status(404).json({
            status: 'error',
            message: "لم يتم العثور على الفعالية"
        })
    }

    if (event.image) {
        const imagePath = path.join(process.env.UPLOAD_PATH || "./uploads", event.image)
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath)
        }
    }

    await Event.findByIdAndDelete(req.params.id)

    res.status(200).json({
        success: true,
        message: "تم حذف الفعالية بنجاح"
    })
})

// @desc    Register for event
// @route   POST /api/v1/events/:id/register
// @access  Private
const registerForEvent = asyncHandler(async (req, res, next) => {
    const event = await Event.findById(req.params.id)

    if (!event) {
        return res.status(404).json({
            status: 'error',
            message: "لم يتم العثور على الفعالية"
        })
    }

    if (event.registeredUsers.includes(req.user.id)) {
        return res.status(400).json({
            status: 'error',
            message: "أنت مسجل بالفعل في هذه الفعالية"
        })
    }

    if (new Date(event.date) < new Date()) {
        return res.status(400).json({
            status: 'error',
            message: "لا يمكن التسجيل في فعاليات سابقة"
        })
    }

    event.registeredUsers.push(req.user.id)
    await event.save()

    const updatedEvent = await Event.findById(req.params.id)
        .populate("createdBy", "name email")
        .populate("registeredUsers", "name email")

    const safeEvent = updatedEvent.toObject()
    delete safeEvent.guestRegistrations
    safeEvent.guestRegistrationsCount = (updatedEvent.guestRegistrations || []).length

    res.status(200).json({
        success: true,
        data: safeEvent
    })
})

// @desc    Get event registered users (Admin only)
// @route   GET /api/v1/events/:id/registered
// @access  Private/Admin
const getEventRegisteredUsers = asyncHandler(async (req, res, next) => {
    const event = await Event.findById(req.params.id)
        .populate("registeredUsers", "name email phone university governorate role nationalId position")

    if (!event) {
        return res.status(404).json({
            status: 'error',
            message: "لم يتم العثور على الفعالية"
        })
    }

    res.status(200).json({
        success: true,
        data: {
            registeredUsers: event.registeredUsers || [],
            guestRegistrations: event.guestRegistrations || []
        }
    })
})

// @desc    Guest register for event
// @route   POST /api/v1/events/:id/guest-register
// @access  Public
const guestRegisterForEvent = asyncHandler(async (req, res, next) => {
    const event = await Event.findById(req.params.id)
    if (!event) {
        return res.status(404).json({
            status: 'error',
            message: "لم يتم العثور على الفعالية"
        })
    }

    if (new Date(event.date) < new Date()) {
        return res.status(400).json({
            status: 'error',
            message: "لا يمكن التسجيل في فعاليات سابقة"
        })
    }

    const { error } = guestEventRegistrationSchema.validate(req.body, { messages: arabicJoiMessages })
    if (error) {
        return res.status(400).json({
            status: 'error',
            message: error.details[0].message
        })
    }

    const { name, email, phone, nationalId, governorate } = req.body

    const alreadyGuest = (event.guestRegistrations || []).some(
        (g) => g.email.toLowerCase() === email.toLowerCase() || (nationalId && g.nationalId === nationalId)
    )
    const alreadyUser = (event.registeredUsers || []).some((u) => String(u) === (req.user?.id || ""))

    if (alreadyGuest || alreadyUser) {
        return res.status(400).json({
            status: 'error',
            message: "مسجل بالفعل في هذه الفعالية"
        })
    }

    event.guestRegistrations = event.guestRegistrations || []
    event.guestRegistrations.push({ name, email, phone, nationalId, governorate })
    await event.save()

    const updated = await Event.findById(req.params.id)
        .populate("createdBy", "name email")
        .populate("registeredUsers", "name email")

    const safeEvent = updated.toObject()
    delete safeEvent.guestRegistrations
    safeEvent.guestRegistrationsCount = (updated.guestRegistrations || []).length

    res.status(200).json({
        success: true,
        data: safeEvent
    })
})

module.exports = {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    registerForEvent,
    getEventRegisteredUsers,
    guestRegisterForEvent,
}
