const express = require("express")
const {
    getCustomFields,
    getCustomField,
    createCustomField,
    updateCustomField,
    deleteCustomField,
} = require("../controllers/customFieldController")
const { protect, admin } = require("../middleware/auth")

const router = express.Router()

// Public (authenticated) — get active fields for profile form
router.get("/", protect, getCustomFields)

// Admin only
router.get("/:id", protect, admin, getCustomField)
router.post("/", protect, admin, createCustomField)
router.put("/:id", protect, admin, updateCustomField)
router.delete("/:id", protect, admin, deleteCustomField)

module.exports = router
