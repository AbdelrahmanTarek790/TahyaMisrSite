const mongoose = require("mongoose")

// Subdocument schema for guest registrations (non-account attendees)
const guestRegistrationSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, lowercase: true, trim: true },
        phone: { type: String, trim: true },
        nationalId: { type: String, trim: true },
        governorate: { type: String, trim: true },
        createdAt: { type: Date, default: Date.now },
    },
    { _id: false }
)

const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Event title is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Event description is required"],
        },
        date: {
            type: Date,
            required: [true, "Event date is required"],
        },
        location: {
            type: String,
            required: [true, "Event location is required"],
            trim: true,
        },
        image: {
            type: String,
            default: null,
        },
        registeredUsers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        // For attendees without an account
        guestRegistrations: [guestRegistrationSchema],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

// Indexes for performance
eventSchema.index({ date: 1 })
eventSchema.index({ createdAt: -1 })
eventSchema.index({ createdBy: 1 })
eventSchema.index({ "guestRegistrations.email": 1 })
eventSchema.index({ "guestRegistrations.nationalId": 1 })

module.exports = mongoose.model("Event", eventSchema)
