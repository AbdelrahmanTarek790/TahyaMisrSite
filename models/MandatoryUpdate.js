const mongoose = require("mongoose")

const mandatoryUpdateSchema = new mongoose.Schema(
    {
        fields: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "CustomField",
                required: true,
            },
        ],
        targetType: {
            type: String,
            required: [true, "Target type is required"],
            enum: {
                values: ["global", "targeted"],
                message: "Target type must be either 'global' or 'targeted'",
            },
        },
        targetUserIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        adminMessage: {
            type: String,
            required: [true, "Admin message is required"],
            trim: true,
            minlength: [5, "Message must be at least 5 characters"],
            maxlength: [500, "Message must be at most 500 characters"],
        },
        completedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        isActive: {
            type: Boolean,
            default: true,
        },
        notifyByEmail: {
            type: Boolean,
            default: false,
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

// Index for efficient user-facing queries
mandatoryUpdateSchema.index({ isActive: 1, targetType: 1 })
mandatoryUpdateSchema.index({ targetUserIds: 1 })
mandatoryUpdateSchema.index({ completedBy: 1 })

module.exports = mongoose.model("MandatoryUpdate", mandatoryUpdateSchema)
