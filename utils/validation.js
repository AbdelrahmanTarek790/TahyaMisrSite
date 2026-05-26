const Joi = require("joi")

// User validation schemas
const registerSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().min(10).max(15).required(),
    university: Joi.string().min(2).max(100).required(),
    nationalId: Joi.string().min(14).max(14).optional(),
    governorate: Joi.string().min(2).max(50).required(),
    position: Joi.string().optional(),
    membershipNumber: Joi.string().optional(),
    membershipExpiry: Joi.date().optional(),
    role: Joi.string().valid("member", "volunteer", "publisher", "admin", "partnership_manager", "hr", "coordinator").optional(),
    rating: Joi.number().min(0).max(100).optional(),
    customFieldValues: Joi.array()
        .items(
            Joi.object({
                fieldId: Joi.string().required(),
                value: Joi.alternatives()
                    .try(Joi.string().allow(""), Joi.array().items(Joi.string().allow("")))
                    .required(),
            }),
        )
        .optional(),
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
    position: Joi.string().optional(),
    membershipNumber: Joi.string().optional(),
    membershipExpiry: Joi.date().optional(),
    email: Joi.string().email().optional(),
    nationalId: Joi.string().min(14).max(14).optional(),
    role: Joi.string().valid("member", "volunteer", "publisher", "admin", "partnership_manager", "hr", "coordinator").optional(),
    rating: Joi.number().min(0).max(100).optional(),
    customFieldValues: Joi.array()
        .items(
            Joi.object({
                fieldId: Joi.string().required(),
                value: Joi.alternatives()
                    .try(Joi.string().allow(""), Joi.array().items(Joi.string().allow("")))
                    .required(),
            }),
        )
        .optional(),
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
    sendNotification: Joi.boolean().default(false),
})

// Event validation schemas
const eventSchema = Joi.object({
    title: Joi.string().min(5).max(200).required(),
    description: Joi.string().min(10).required(),
    date: Joi.date().required(),
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
    userIds: Joi.array().items(Joi.string()).optional(),
})

// Custom Field validation schema
const customFieldSchema = Joi.object({
    label: Joi.string().min(2).max(100).required(),
    type: Joi.string().valid("text", "textarea", "number", "email", "phone", "radio", "checkbox_list").required(),
    isPublic: Joi.boolean().optional(),
    status: Joi.string().valid("active", "inactive").optional(),
    order: Joi.number().optional(),
    options: Joi.array()
        .items(Joi.string().min(1))
        .when("type", {
            is: Joi.string().valid("radio", "checkbox_list"),
            then: Joi.required(),
            otherwise: Joi.optional(),
        }),
})

// Mandatory Update validation schema
const mandatoryUpdateSchema = Joi.object({
    fields: Joi.array().items(Joi.string().required()).min(1).required(),
    targetType: Joi.string().valid("global", "targeted").required(),
    targetUserIds: Joi.array().items(Joi.string()).optional(),
    adminMessage: Joi.string().min(5).max(500).required(),
    notifyByEmail: Joi.boolean().optional(),
})

// Complete mandatory update validation schema
const completeMandatoryUpdateSchema = Joi.object({
    customFieldValues: Joi.array()
        .items(
            Joi.object({
                fieldId: Joi.string().required(),
                value: Joi.alternatives()
                    .try(Joi.string().allow(""), Joi.array().items(Joi.string().allow("")))
                    .required(),
            }),
        )
        .min(1)
        .required(),
})

// OTP validation schemas
const verifyOtpSchema = Joi.object({
    email: Joi.string().email().required(),
    otpCode: Joi.string().length(6).required(),
})

const resendOtpSchema = Joi.object({
    email: Joi.string().email().required(),
})

const arabicJoiMessages = {
    "any.required": "هذا الحقل مطلوب.",
    "string.empty": "لا يمكن أن يكون هذا الحقل فارغاً.",
    "string.email": "البريد الإلكتروني غير صالح.",
    "string.min": "يجب أن يكون هذا الحقل على الأقل {#limit} أحرف.",
    "string.max": "لا يمكن أن يتجاوز هذا الحقل {#limit} أحرف.",
    "string.length": "يجب أن يكون هذا الحقل بطول {#limit} أحرف.",
    "string.hex": "يجب أن يكون هذا الحقل بصيغة معرف صحيحة.",
    "number.base": "يجب أن تكون القيمة رقماً.",
    "number.min": "يجب أن تكون القيمة على الأقل {#limit}.",
    "number.max": "يجب أن تكون القيمة لا تتجاوز {#limit}.",
    "date.base": "يجب أن تكون القيمة تاريخاً صالحاً.",
    "any.only": "القيمة المدخلة غير صالحة.",
}

module.exports = {
    arabicJoiMessages,
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
    customFieldSchema,
    mandatoryUpdateSchema,
    completeMandatoryUpdateSchema,
    verifyOtpSchema,
    resendOtpSchema,
}
