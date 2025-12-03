const mongoose = require("mongoose")

const siteSettingsSchema = new mongoose.Schema(
    {
        joinRequestsEnabled: {
            type: Boolean,
            default: true,
            required: true,
        },
        maintenanceMode: {
            type: Boolean,
            default: false,
        },
        maintenanceMessage: {
            type: String,
            default: "الموقع تحت الصيانة حالياً",
        },
        joinRequestMessage: {
            type: String,
            default: "عذراً، التسجيل غير متاح حالياً",
        },
    },
    {
        timestamps: true,
    }
)

// Ensure only one settings document exists
siteSettingsSchema.statics.getSettings = async function () {
    let settings = await this.findOne()
    if (!settings) {
        settings = await this.create({})
    }
    return settings
}

siteSettingsSchema.statics.updateSettings = async function (updates) {
    let settings = await this.findOne()
    if (!settings) {
        settings = await this.create(updates)
    } else {
        Object.assign(settings, updates)
        await settings.save()
    }
    return settings
}

const SiteSettings = mongoose.model("SiteSettings", siteSettingsSchema)

module.exports = SiteSettings
