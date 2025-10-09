const express = require("express")
const router = express.Router()
const { protect, authorize } = require("../middleware/auth")
const { upload } = require("../utils/upload")
const { listHeroImages, createHeroImage, updateHeroImage, deleteHeroImage, listHeroImagesAdmin } = require("../controllers/heroImageController")

// Public: list active hero images
router.get("/", listHeroImages)

// Admin only: manage hero images
// Use media profile for large hero background images
router.post("/", protect, authorize("admin"), ...upload.media("file"), createHeroImage)
router.get("/admin", protect, authorize("admin"), listHeroImagesAdmin)
router.put("/:id", protect, authorize("admin"), updateHeroImage)
router.delete("/:id", protect, authorize("admin"), deleteHeroImage)

module.exports = router
