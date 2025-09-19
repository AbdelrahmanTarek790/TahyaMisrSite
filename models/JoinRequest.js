const mongoose = require("mongoose")

const joinRequestSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
        },
        nationalID: {
            type: String,
            required: [true, "National ID is required"],
            trim: true,
        },
        governorate: {
            type: String,
            required: [true, "Governorate is required"],
            trim: true,
        },
        position: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Position",
            required: false,
        },
        membershipNumber: {
            type: String,
            trim: true,
            required: false,
        },
        role: {
            type: String,
            enum: ["member", "volunteer"],
            required: [true, "Role is required"],
            default: "member",
        },
        status: {
            type: String,
            enum: ["pending", "approved", "denied"],
            default: "pending",
        },
        notes: {
            type: String,
            trim: true,
        },
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        reviewedAt: {
            type: Date,
        },
        approvalNotes: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
)

// Indexes for performance
joinRequestSchema.index({ status: 1 })
joinRequestSchema.index({ email: 1 })
joinRequestSchema.index({ nationalID: 1 })
joinRequestSchema.index({ createdAt: -1 })

// Method to approve the request
joinRequestSchema.methods.approve = function (adminId, notes = "") {
    this.status = "approved"
    this.reviewedBy = adminId
    this.reviewedAt = new Date()
    this.approvalNotes = notes
    return this.save()
}

// Method to deny the request
joinRequestSchema.methods.deny = function (adminId, notes = "") {
    this.status = "denied"
    this.reviewedBy = adminId
    this.reviewedAt = new Date()
    this.approvalNotes = notes
    return this.save()
}

module.exports = mongoose.model("JoinRequest", joinRequestSchema)
