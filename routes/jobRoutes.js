const express = require("express");
const {
    getJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob
} = require("../controllers/jobController");
const { protect, admin, authorize } = require("../middleware/auth");
const { upload } = require("../utils/upload")

const router = express.Router();

router.get("/", getJobs)
router.get("/:id", getJobById)

// Admin and Jobs routes
router.post("/", protect, authorize("admin", "jobs-and-internships"), ...upload.single("imageUrl"), createJob)
router.put("/:id", protect, authorize("admin", "jobs-and-internships"), ...upload.single("imageUrl"), updateJob)
router.delete("/:id", protect, authorize("admin", "jobs-and-internships"), deleteJob)

module.exports = router;
