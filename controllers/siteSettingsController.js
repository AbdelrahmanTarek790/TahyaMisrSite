const SiteSettings = require("../models/SiteSettings")

// Get site settings
const getSettings = async (req, res) => {
    try {
        const settings = await SiteSettings.getSettings()
        res.json(settings)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Update site settings
const updateSettings = async (req, res) => {
    try {
        const { joinRequestsEnabled, maintenanceMode, maintenanceMessage, joinRequestMessage } = req.body

        const updates = {}
        if (typeof joinRequestsEnabled !== "undefined") updates.joinRequestsEnabled = joinRequestsEnabled
        if (typeof maintenanceMode !== "undefined") updates.maintenanceMode = maintenanceMode
        if (maintenanceMessage) updates.maintenanceMessage = maintenanceMessage
        if (joinRequestMessage) updates.joinRequestMessage = joinRequestMessage

        const settings = await SiteSettings.updateSettings(updates)
        res.json(settings)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Toggle join requests
const toggleJoinRequests = async (req, res) => {
    try {
        const settings = await SiteSettings.getSettings()
        settings.joinRequestsEnabled = !settings.joinRequestsEnabled
        await settings.save()

        res.json({
            message: `Join requests ${settings.joinRequestsEnabled ? "enabled" : "disabled"}`,
            joinRequestsEnabled: settings.joinRequestsEnabled,
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    getSettings,
    updateSettings,
    toggleJoinRequests,
}
