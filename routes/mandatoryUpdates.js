const express = require("express")
const {
    getMandatoryUpdates,
    getAdminMandatoryUpdates,
    createMandatoryUpdate,
    updateMandatoryUpdate,
    deleteMandatoryUpdate,
    completeMandatoryUpdate,
} = require("../controllers/mandatoryUpdateController")
const { protect, admin } = require("../middleware/auth")

const router = express.Router()

// User routes — check pending mandatory updates
router.get("/", protect, getMandatoryUpdates)

// Completion route — user submits field values
router.post("/:id/complete", protect, completeMandatoryUpdate)

// Admin routes — manage mandatory update rules
router.get("/admin", protect, admin, getAdminMandatoryUpdates)
router.post("/", protect, admin, createMandatoryUpdate)
router.put("/:id", protect, admin, updateMandatoryUpdate)
router.delete("/:id", protect, admin, deleteMandatoryUpdate)

module.exports = router
