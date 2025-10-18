const Event = require("../models/Event")
const { eventSchema, guestEventRegistrationSchema } = require("../utils/validation")
const path = require("path")
const fs = require("fs")

// @desc    Get all events
// @route   GET /api/v1/events
// @access  Public
const getEvents = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit

        const events = await Event.find()
            .populate("createdBy", "name email")
            .populate("registeredUsers", "name email")
            .skip(skip)
            .limit(limit)
            .sort({ date: 1 })

        const total = await Event.countDocuments()

        // Map to include counts (avoid exposing guest emails by default)
        const safeEvents = events.map((e) => {
            const obj = e.toObject()
            delete obj.guestRegistrations // don't expose guest PII in list
            obj.guestRegistrationsCount = (e.guestRegistrations || []).length
            return obj
        })

        res.status(200).json({
            success: true,
            data: {
                events: safeEvents,
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

// @desc    Get single event
// @route   GET /api/v1/events/:id
// @access  Public
const getEventById = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id).populate("createdBy", "name email").populate("registeredUsers", "name email")

        if (!event) {
            return res.status(404).json({
                success: false,
                error: "Event not found",
                data: null,
            })
        }

        const safeEvent = event.toObject()
        delete safeEvent.guestRegistrations // don't expose guest PII in detail by default
        safeEvent.guestRegistrationsCount = (event.guestRegistrations || []).length

        res.status(200).json({
            success: true,
            data: safeEvent,
            error: null,
        })
    } catch (error) {
        next(error)
    }
}

// @desc    Create event
// @route   POST /api/v1/events
// @access  Private/Admin
const createEvent = async (req, res, next) => {
    try {
        // Validate input
        const { error } = eventSchema.validate(req.body)
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

        const event = await Event.create(req.body)

        const populatedEvent = await Event.findById(event._id).populate("createdBy", "name email")

        res.status(201).json({
            success: true,
            data: populatedEvent,
            error: null,
        })
    } catch (error) {
        next(error)
    }
}

// @desc    Update event
// @route   PUT /api/v1/events/:id
// @access  Private/Admin
const updateEvent = async (req, res, next) => {
    try {
        // Validate input
        const { error } = eventSchema.validate(req.body)
        if (error) {
            return res.status(400).json({
                success: false,
                error: error.details[0].message,
                data: null,
            })
        }

        const existingEvent = await Event.findById(req.params.id)

        if (!existingEvent) {
            return res.status(404).json({
                success: false,
                error: "Event not found",
                data: null,
            })
        }

        // Handle image update
        if (req.file) {
            // Delete old image if exists
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
            data: event,
            error: null,
        })
    } catch (error) {
        next(error)
    }
}

// @desc    Delete event
// @route   DELETE /api/v1/events/:id
// @access  Private/Admin
const deleteEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id)

        if (!event) {
            return res.status(404).json({
                success: false,
                error: "Event not found",
                data: null,
            })
        }

        // Delete associated image
        if (event.image) {
            const imagePath = path.join(process.env.UPLOAD_PATH || "./uploads", event.image)
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath)
            }
        }

        await Event.findByIdAndDelete(req.params.id)

        res.status(200).json({
            success: true,
            data: { message: "Event deleted successfully" },
            error: null,
        })
    } catch (error) {
        next(error)
    }
}

// @desc    Register for event
// @route   POST /api/v1/events/:id/register
// @access  Private
const registerForEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id)

        if (!event) {
            return res.status(404).json({
                success: false,
                error: "Event not found",
                data: null,
            })
        }

        // Check if user is already registered
        if (event.registeredUsers.includes(req.user.id)) {
            return res.status(400).json({
                success: false,
                error: "You are already registered for this event",
                data: null,
            })
        }

        // Check if event date has passed
        if (new Date(event.date) < new Date()) {
            return res.status(400).json({
                success: false,
                error: "Cannot register for past events",
                data: null,
            })
        }

        // Add user to registered users
        event.registeredUsers.push(req.user.id)
        await event.save()

        const updatedEvent = await Event.findById(req.params.id).populate("createdBy", "name email").populate("registeredUsers", "name email")

        const safeEvent = updatedEvent.toObject()
        delete safeEvent.guestRegistrations
        safeEvent.guestRegistrationsCount = (updatedEvent.guestRegistrations || []).length

        res.status(200).json({
            success: true,
            data: safeEvent,
            error: null,
        })
    } catch (error) {
        next(error)
    }
}

// @desc    Get registered users for event
// @route   GET /api/v1/events/:id/registered-users
// @access  Private/Admin
const getEventRegisteredUsers = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id).populate({
            path: "registeredUsers",
            select: "name phone nationalId email position university governorate createdAt",
            populate: {
                path: "position",
                select: "name",
            },
        })

        if (!event) {
            return res.status(404).json({
                success: false,
                error: "Event not found",
                data: null,
            })
        }

        res.status(200).json({
            success: true,
            data: {
                eventTitle: event.title,
                eventDate: event.date,
                registeredUsers: event.registeredUsers,
                guestRegistrations: event.guestRegistrations || [],
            },
            error: null,
        })
    } catch (error) {
        next(error)
    }
}

// @desc    Public guest registration for event (no account required)
// @route   POST /api/v1/events/:id/guest-register
// @access  Public
const guestRegisterForEvent = async (req, res, next) => {
    try {
        const { error } = guestEventRegistrationSchema.validate(req.body)
        if (error) {
            return res.status(400).json({ success: false, error: error.details[0].message, data: null })
        }

        const event = await Event.findById(req.params.id)
        if (!event) {
            return res.status(404).json({ success: false, error: "Event not found", data: null })
        }

        // Disallow registration for past events
        if (new Date(event.date) < new Date()) {
            return res.status(400).json({ success: false, error: "Cannot register for past events", data: null })
        }

        const { name, email, phone, nationalId, governorate } = req.body

        // Prevent duplicate guest registration by email
        const alreadyGuest = (event.guestRegistrations || []).some(
            (g) => g.email.toLowerCase() === email.toLowerCase() || (nationalId && g.nationalId === nationalId)
        )
        const alreadyUser = (event.registeredUsers || []).some((u) => String(u) === (req.user?.id || "")) // usually not present here

        if (alreadyGuest || alreadyUser) {
            return res.status(400).json({ success: false, error: "Already registered for this event", data: null })
        }

        event.guestRegistrations = event.guestRegistrations || []
        event.guestRegistrations.push({ name, email, phone, nationalId, governorate })
        await event.save()

        const updated = await Event.findById(req.params.id).populate("createdBy", "name email").populate("registeredUsers", "name email")

        const safeEvent = updated.toObject()
        delete safeEvent.guestRegistrations
        safeEvent.guestRegistrationsCount = (updated.guestRegistrations || []).length

        return res.status(200).json({ success: true, data: safeEvent, error: null })
    } catch (err) {
        next(err)
    }
}

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
