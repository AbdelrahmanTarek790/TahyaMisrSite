const express = require("express")
const { register, login, forgotPassword, resetPassword, changePassword } = require("../controllers/authController")
const { protect, authorize } = require("../middleware/auth")
const { upload } = require("../utils/upload")

const router = express.Router()

// Register route commented out - accounts are now created only by admins or via join requests
router.post("/register", protect, authorize("admin"), ...upload.profile(), register)
router.post("/login", login)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password", resetPassword)
router.put("/change-password", protect, changePassword)

module.exports = router
