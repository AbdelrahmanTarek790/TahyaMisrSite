const mongoose = require("mongoose")

const customFieldSchema = new mongoose.Schema(
    {
        label: {
            type: String,
            required: [true, "Field label is required"],
            trim: true,
            minlength: [2, "Label must be at least 2 characters"],
            maxlength: [100, "Label must be at most 100 characters"],
        },
        type: {
            type: String,
            required: [true, "Field type is required"],
            enum: {
                values: ["text", "textarea", "number", "email", "phone", "radio", "checkbox_list"],
                message: "Type must be one of: text, textarea, number, email, phone, radio, checkbox_list",
            },
        },
        options: {
            type: [String],
        },
        isPublic: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
)

// Index for querying active fields efficiently
customFieldSchema.index({ status: 1, order: 1 })

module.exports = mongoose.model("CustomField", customFieldSchema)
