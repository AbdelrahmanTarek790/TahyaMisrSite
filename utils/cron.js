const cron = require("node-cron")
const SiteSettings = require("../models/SiteSettings")

// Schedule a task to run every day at midnight
cron.schedule("0 0 * * *", async () => {
    try {
        const settings = await SiteSettings.getSettings()
        settings.activeMembers += Math.floor(Math.random() * 20) + 1 // Increment by 1 to 20 randomly
        await settings.save()
        console.log(`Active members updated to: ${settings.activeMembers}`)
    } catch (error) {
        console.error("Error updating active members:", error)
    }
})