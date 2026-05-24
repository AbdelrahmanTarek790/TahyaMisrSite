const express = require("express")
const router = express.Router()
const {
    createJoinRequest,
    getJoinRequests,
    getJoinRequest,
    approveJoinRequest,
    denyJoinRequest,
    deleteJoinRequest,
    verifyOtp,
    resendOtp,
} = require("../controllers/joinRequestController")
const { protect, authorize } = require("../middleware/auth")

// Public routes
router.post("/", createJoinRequest)
router.post("/verify-otp", verifyOtp)
router.post("/resend-otp", resendOtp)

// Admin/HR only routes
router.use(protect)
router.use(authorize("admin", "hr"))

router.get("/", getJoinRequests)
router.get("/:id", getJoinRequest)
router.patch("/:id/approve", approveJoinRequest)
router.patch("/:id/deny", denyJoinRequest)
router.delete("/:id", deleteJoinRequest)

module.exports = router
