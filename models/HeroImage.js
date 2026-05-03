const mongoose = require("mongoose")

const heroImageSchema = new mongoose.Schema(
    {
        title: { type: String, trim: true },
        description: { type: String, trim: true },
        imagePath: { type: String, required: true }, // stored filename in uploads
        order: { type: Number, default: 0 }, // for ordering in carousel
        isActive: { type: Boolean, default: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    },
    {
        timestamps: true,
    }
)

heroImageSchema.index({ isActive: 1, order: 1, createdAt: -1 })

module.exports = mongoose.model("HeroImage", heroImageSchema)
