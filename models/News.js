const mongoose = require("mongoose")
const slugify = require("slugify")
const newsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "News title is required"],
            trim: true,
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
        },
        content: {
            type: String,
            required: [true, "News content is required"],
        },
        image: {
            type: String,
            default: null,
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

// Index for performance
newsSchema.index({ createdAt: -1 })
newsSchema.index({ createdBy: 1 })
// Pre-save middleware to generate slug from title
newsSchema.pre("save", function (next) {
    if (this.isModified("title")) {
        this.slug = slugify(this.title, { lower: true, strict: true })
    }
    next()
})

module.exports = mongoose.model("News", newsSchema)
