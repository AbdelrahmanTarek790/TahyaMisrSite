const express = require("express")
const { getUsers, getUser, updateUser, deleteUser } = require("../controllers/userController")
const { getMe, updateMe } = require("../controllers/authController")
const { protect, admin } = require("../middleware/auth")
const { upload } = require("../utils/upload")

const router = express.Router()

// Current user routes (require authentication)
router.get("/me", protect, getMe)
router.put("/me", protect, ...upload.profile(), updateMe)

// Admin routes (require admin role)
router.get("/", protect, admin, getUsers)
router.get("/:id", protect, admin, getUser)
router.put("/:id", protect, admin, updateUser)
router.delete("/:id", protect, admin, deleteUser)

module.exports = router
