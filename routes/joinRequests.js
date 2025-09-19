const express = require("express")
const router = express.Router()
const {
    createJoinRequest,
    getJoinRequests,
    getJoinRequest,
    approveJoinRequest,
    denyJoinRequest,
    deleteJoinRequest,
} = require("../controllers/joinRequestController")
const { protect, authorize } = require("../middleware/auth")

// Public routes
router.post("/", createJoinRequest)

// Admin only routes
router.use(protect)
router.use(authorize("admin"))

router.get("/", getJoinRequests)
router.get("/:id", getJoinRequest)
router.patch("/:id/approve", approveJoinRequest)
router.patch("/:id/deny", denyJoinRequest)
router.delete("/:id", deleteJoinRequest)

module.exports = router
