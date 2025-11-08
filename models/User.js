const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const crypto = require("crypto")

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
            unique: true,
        },
        university: {
            type: String,
            required: [true, "University is required"],
            trim: true,
        },
        nationalId: {
            type: String,
            required: [true, "National ID is required"],
            unique: true,
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
        },
        profileImage: {
            type: String,
            // required: [true, 'Profile image is required']
        },
        membershipNumber: {
            type: String,
            unique: true,
            sparse: true,
            trim: true,
        },
        membershipExpiry: {
            type: Date,
        },
        role: {
            type: String,
            enum: ["member", "volunteer", "admin"],
            default: "member",
        },
        resetPasswordToken: {
            type: String,
        },
        resetPasswordExpiry: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
)

// Indexes for performance (remove manual indexes to avoid duplicates)
userSchema.index({ role: 1 })

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next()
    }

    try {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
        next()
    } catch (error) {
        next(error)
    }
})

// Method to check password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

// Method to generate password reset token
userSchema.methods.getResetPasswordToken = function () {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString("hex")

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")

    // Set expire to 10 minutes
    this.resetPasswordExpiry = Date.now() + 10 * 60 * 1000

    return resetToken
}

// Remove password from JSON output
userSchema.methods.toJSON = function () {
    const user = this.toObject()
    delete user.password
    delete user.resetPasswordToken
    delete user.resetPasswordExpiry
    return user
}

module.exports = mongoose.model("User", userSchema)
