const mongoose = require("mongoose");
const slugify = require("slugify")
const JobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please add a title"]
    },
    description: {
        type: String,
        required: [true, "Please add a description"]
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
    },
    imageUrl: {
        type: String,
        required: [true, "Please add an image URL"]
    },
    category: {
        type: String,
        required: [true, "Please specify a category"],
        enum: ['trainings', 'scholarships', 'jobs', 'trips', 'camps', 'exhibitions_and_conferences']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Pre-save middleware to generate slug from title
JobSchema.pre("save", function (next) {
    if (this.isModified("title")) {
        this.slug = slugify(this.title, { lower: true, strict: true })
    }
    next()
})
module.exports = mongoose.model("Job", JobSchema);

