const express = require("express")
const router = express.Router()
const { protect, authorize } = require("../middleware/auth")
const { upload } = require("../utils/upload")
const {
    getAchievements,
    getAchievementById,
    createAchievement,
    updateAchievement,
    deleteAchievement,
    toggleAchievementStatus,
    reorderAchievements,
} = require("../controllers/achievementController")

// Public routes
router.get("/", getAchievements)
router.get("/:id", getAchievementById)

// Protected routes (Admin only)
router.post("/", protect, authorize("admin"), ...upload.single("image", "default"), createAchievement)
router.put("/reorder", protect, authorize("admin"), reorderAchievements)
router.put("/:id", protect, authorize("admin"), ...upload.single("image", "default"), updateAchievement)
router.delete("/:id", protect, authorize("admin"), deleteAchievement)
router.patch("/:id/toggle", protect, authorize("admin"), toggleAchievementStatus)

module.exports = router
