const express = require("express")
const { getUsers, getUser, updateUser, deleteUser, getUserStats } = require("../controllers/userController")
const { getMe, updateMe } = require("../controllers/authController")
const { protect, admin, authorize } = require("../middleware/auth")
const { upload } = require("../utils/upload")

const router = express.Router()

// Current user routes (require authentication)
router.get("/me", protect, getMe)
router.put("/me", protect, ...upload.profile(), updateMe)

// Admin/HR/Coordinator routes
router.get("/stats", protect, authorize("admin", "hr", "coordinator"), getUserStats)
router.get("/", protect, authorize("admin", "hr", "coordinator"), getUsers)
router.get("/:id", protect, authorize("admin", "hr", "coordinator"), getUser)
router.put("/:id", protect, authorize("admin", "hr"), ...upload.profile(), updateUser)
router.delete("/:id", protect, authorize("admin"), deleteUser)

module.exports = router
