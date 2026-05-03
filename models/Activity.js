const mongoose = require("mongoose")

const activitySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        image: {
            type: String,
            default: null,
        },
        color: {
            type: String,
            default: "bg-gradient-to-br from-egypt-red to-egypt-gold",
        },
        order: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
)

// Index for sorting by order
activitySchema.index({ order: 1 })

// Index for active activities
activitySchema.index({ isActive: 1 })

module.exports = mongoose.model("Activity", activitySchema)
