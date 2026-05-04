const mongoose = require("mongoose")

const privilegeSchema = new mongoose.Schema(
    {
        partnerName: {
            type: String,
            required: [true, "Partner name is required"],
            trim: true,
        },
        logo: {
            type: String,
        },
        description: {
            type: String,
            trim: true,
        },
        privileges: [
            {
                type: String,
                trim: true,
            },
        ],
        contactInfo: {
            type: String,
            trim: true,
        },
        address: {
            type: String,
            trim: true,
        },
        type: {
            type: String,
            enum: ["partner", "union"],
            required: [true, "Type (partner/union) is required"],
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

module.exports = mongoose.model("Privilege", privilegeSchema)
