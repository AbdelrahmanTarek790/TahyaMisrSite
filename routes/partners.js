const express = require("express")
const router = express.Router()
const { getPartners, createPartner, updatePartner, deletePartner } = require("../controllers/partnerController")
const { protect, authorize } = require("../middleware/auth")
const { upload } = require("../utils/upload")

router
    .route("/")
    .get(getPartners)
    .post(protect, authorize("admin", "partnership_manager"), ...upload.single("logo", "default"), createPartner)

router
    .route("/:id")
    .put(protect, authorize("admin", "partnership_manager"), ...upload.single("logo", "default"), updatePartner)
    .delete(protect, authorize("admin", "partnership_manager"), deletePartner)

module.exports = router
