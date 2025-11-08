const Joi = require("joi")

// User validation schemas
const registerSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().min(10).max(15).required(),
    university: Joi.string().min(2).max(100).required(),
    nationalId: Joi.string().min(14).max(14).required(),
    governorate: Joi.string().min(2).max(50).required(),
    position: Joi.string().hex().length(24).optional(),
    membershipNumber: Joi.string().optional(),
    membershipExpiry: Joi.date().optional(),
})

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
})

const updateUserSchema = Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    phone: Joi.string().min(10).max(15).optional(),
    university: Joi.string().min(2).max(100).optional(),
    governorate: Joi.string().min(2).max(50).optional(),
    position: Joi.string().hex().length(24).optional(),
    membershipNumber: Joi.string().optional(),
    membershipExpiry: Joi.date().optional(),
    email: Joi.string().email().optional(),
    nationalId: Joi.string().min(14).max(14).optional(),
    role: Joi.string().valid("member", "volunteer", "admin").optional(),
})

const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
})

const resetPasswordSchema = Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(6).required(),
})

const changePasswordSchema = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
})

// Position validation schemas
const positionSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().max(500).optional(),
    isActive: Joi.boolean().optional(),
    isGlobal: Joi.boolean().optional(),
    governorate: Joi.string().min(2).max(50).optional(),
})

// News validation schemas
const newsSchema = Joi.object({
    title: Joi.string().min(5).max(200).required(),
    content: Joi.string().min(10).required(),
})

// Event validation schemas
const eventSchema = Joi.object({
    title: Joi.string().min(5).max(200).required(),
    description: Joi.string().min(10).required(),
    date: Joi.date().greater("now").required(),
    location: Joi.string().min(5).max(200).required(),
})

// Guest registration (public, no account required)
const guestEventRegistrationSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(7).max(20).optional(),
    nationalId: Joi.string().min(14).max(14).optional(),
    governorate: Joi.string().min(2).max(50).optional(),
})

// Media validation schemas
const mediaSchema = Joi.object({
    type: Joi.string().valid("photo", "video").required(),
    caption: Joi.string().max(500).optional(),
})

// Notification validation schemas
const notificationSchema = Joi.object({
    title: Joi.string().min(5).max(100).required(),
    message: Joi.string().min(10).max(500).required(),
    userIds: Joi.array().items(Joi.string().hex().length(24)).optional(),
})

module.exports = {
    registerSchema,
    loginSchema,
    updateUserSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema,
    positionSchema,
    newsSchema,
    eventSchema,
    mediaSchema,
    notificationSchema,
    guestEventRegistrationSchema,
}
