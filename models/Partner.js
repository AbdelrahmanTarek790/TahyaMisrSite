const mongoose = require("mongoose")

const partnerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        logo: {
            type: String,
            required: [true, "Logo is required"],
        },
        category: {
            type: String,
            enum: ["strategic", "sponsor"],
            default: "sponsor",
        },
        websiteUrl: {
            type: String,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
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

module.exports = mongoose.model("Partner", partnerSchema)
