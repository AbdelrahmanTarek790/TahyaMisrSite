const express = require("express")
const router = express.Router()
const { getHonorMembers, getHonorMemberById, createHonorMember, updateHonorMember, deleteHonorMember } = require("../controllers/honorMemberController")
const { protect, authorize } = require("../middleware/auth")

router
    .route("/")
    .get(getHonorMembers)
    .post(protect, authorize("admin"), createHonorMember)

router
    .route("/:id")
    .get(getHonorMemberById)
    .put(protect, authorize("admin"), updateHonorMember)
    .delete(protect, authorize("admin"), deleteHonorMember)

module.exports = router
