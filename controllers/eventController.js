const Event = require("../models/Event")
const {eventSchema, guestEventRegistrationSchema, arabicJoiMessages} = require("../utils/validation")
const path = require("path")
const fs = require("fs")
const { Filter } = require("../utils/Filter")
// const Filter = require("../utils/Filter")
// @desc    Get all events
// @route   GET /api/v1/events
// @access  Public
const getEvents = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit
        const search = Filter(req)
        const events = await Event.find()
            .where(search)
            .populate("createdBy", "name")
            // .populate("registeredUsers", "name email")
            .skip(skip)
            .limit(limit)
            .sort({ date: -1 })
        
        const total = await Event.countDocuments(search)

        // Map to include counts (avoid exposing guest emails by default)
        const safeEvents = events.map((e) => {
            const obj = e.toObject()
            delete obj.guestRegistrations // don't expose guest PII in list
            delete obj.registeredUsers
            obj.guestRegistrationsCount = (e.guestRegistrations || []).length
            return obj
        })

        res.status(200).json({
            status: 'error',
            message: null
        })
        }

        const safeEvent = event.toObject()
        delete safeEvent.guestRegistrations // don't expose guest PII in detail by default
        safeEvent.guestRegistrationsCount = (event.guestRegistrations || []).length

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

        const event = await Event.create(req.body)

        const populatedEvent = await Event.findById(event._id).populate("createdBy", "name email")

        res.status(201).json({
            status: 'error',
            message: null
        })
        }

        const existingEvent = await Event.findById(req.params.id)

        if (!existingEvent) {
            return res.status(404).json({
            status: 'error',
            message: "لم يتم العثور على الفعالية"
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
            status: 'error',
            message: null
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
            status: 'error',
            message: null
        })
        }

        // Check if user is already registered
        if (event.registeredUsers.includes(req.user.id)) {
            return res.status(400).json({
            status: 'error',
            message: "أنت مسجل بالفعل في هذه الفعالية"
        })
        }

        // Check if event date has passed
        if (new Date(event.date) < new Date()) {
            return res.status(400).json({
            status: 'error',
            message: "لا يمكن التسجيل في فعاليات سابقة"
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
            status: 'error',
            message: null
        })
        }

        res.status(200).json({
            status: 'error',
            message: null
        })
        }

        const event = await Event.findById(req.params.id)
        if (!event) {
            return res.status(404).json({
            status: 'error',
            message: "لم يتم العثور على الفعالية"
        })
        }

        // Disallow registration for past events
        if (new Date(event.date) < new Date()) {
            return res.status(400).json({
            status: 'error',
            message: "لا يمكن التسجيل في فعاليات سابقة"
        })
        }

        const { name, email, phone, nationalId, governorate } = req.body

        // Prevent duplicate guest registration by email
        const alreadyGuest = (event.guestRegistrations || []).some(
            (g) => g.email.toLowerCase() === email.toLowerCase() || (nationalId && g.nationalId === nationalId)
        )
        const alreadyUser = (event.registeredUsers || []).some((u) => String(u) === (req.user?.id || "")) // usually not present here

        if (alreadyGuest || alreadyUser) {
            return res.status(400).json({
            status: 'error',
            message: "مسجل بالفعل في هذه الفعالية"
        })
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
