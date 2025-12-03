const express = require("express")
const { getSettings, updateSettings, toggleJoinRequests } = require("../controllers/siteSettingsController")
const { protect, admin } = require("../middleware/auth")

const router = express.Router()

// Public route - get settings
router.get("/", getSettings)

// Admin only routes
router.put("/", protect, admin, updateSettings)
router.post("/toggle-join-requests", protect, admin, toggleJoinRequests)

module.exports = router
