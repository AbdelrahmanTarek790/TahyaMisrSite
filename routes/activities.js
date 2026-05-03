const express = require("express")
const router = express.Router()
const { protect, authorize } = require("../middleware/auth")
const { upload } = require("../utils/upload")
const {
    getActivities,
    getActivityById,
    createActivity,
    updateActivity,
    deleteActivity,
    toggleActivityStatus,
    reorderActivities,
} = require("../controllers/activityController")

// Public routes
router.get("/", getActivities)
router.get("/:id", getActivityById)

// Protected routes (Admin only)
router.post("/", protect, authorize("admin"), ...upload.single("image", "default"), createActivity)
router.put("/reorder", protect, authorize("admin"), reorderActivities)
router.put("/:id", protect, authorize("admin"), ...upload.single("image", "default"), updateActivity)
router.delete("/:id", protect, authorize("admin"), deleteActivity)
router.patch("/:id/toggle", protect, authorize("admin"), toggleActivityStatus)

module.exports = router
