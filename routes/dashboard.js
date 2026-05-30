const express = require("express")
const { getDashboardStats } = require("../controllers/dashboardController")
const { protect, authorize } = require("../middleware/auth")

const router = express.Router()

// All dashboard stats require authentication
// We allow all administrative roles to see these stats
router.get("/stats", protect, authorize("admin", "hr", "coordinator", "publisher", "partnership_manager","jobs-and-internships"), getDashboardStats)

module.exports = router
