const mongoose = require("mongoose")

const achievementSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Description is required"],
        },
        highlights: {
            type: [String],
            default: [],
        },
        color: {
            type: String,
            default: "text-egypt-gold",
        },
        image: {
            type: String,
            default: null,
        },
        icon: {
            type: String,
            default: "Award",
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
achievementSchema.index({ order: 1 })

// Index for active achievements
achievementSchema.index({ isActive: 1 })

module.exports = mongoose.model("Achievement", achievementSchema)
