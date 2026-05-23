const SiteSettings = require("../models/SiteSettings")
const asyncHandler = require("../middleware/asyncHandler")

// Get site settings
const getSettings = asyncHandler(async (req, res, next) => {
    const settings = await SiteSettings.getSettings()
    res.status(200).json({
        success: true,
        data: settings
    })
})

// Update site settings
const updateSettings = asyncHandler(async (req, res, next) => {
    const { joinRequestsEnabled, maintenanceMode, maintenanceMessage, joinRequestMessage } = req.body

    const updates = {}
    if (typeof joinRequestsEnabled !== "undefined") updates.joinRequestsEnabled = joinRequestsEnabled
    if (typeof maintenanceMode !== "undefined") updates.maintenanceMode = maintenanceMode
    if (maintenanceMessage) updates.maintenanceMessage = maintenanceMessage
    if (joinRequestMessage) updates.joinRequestMessage = joinRequestMessage

    const settings = await SiteSettings.updateSettings(updates)
    res.status(200).json({
        success: true,
        message: "تم تحديث إعدادات الموقع بنجاح",
        data: settings
    })
})

// Toggle join requests
const toggleJoinRequests = asyncHandler(async (req, res, next) => {
    const settings = await SiteSettings.getSettings()
    settings.joinRequestsEnabled = !settings.joinRequestsEnabled
    await settings.save()

    res.status(200).json({
        success: true,
        message: settings.joinRequestsEnabled ? "تم تفعيل طلبات الانضمام بنجاح" : "تم تعطيل طلبات الانضمام بنجاح",
        data: { joinRequestsEnabled: settings.joinRequestsEnabled }
    })
})

module.exports = {
    getSettings,
    updateSettings,
    toggleJoinRequests,
}
