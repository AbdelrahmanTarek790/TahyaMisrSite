const express = require("express");
const {
    getJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob
} = require("../controllers/jobController");

const router = express.Router();

// Middlewares
const { protect, admin } = require("../middleware/auth");
const { upload } = require("../utils/upload")

router.route("/")
    .get(getJobs)
    .post(protect, admin, ...upload.single("imageUrl"), createJob);

router.route("/:id")
    .get(getJobById)
    .put(protect, admin, ...upload.single("imageUrl"), updateJob)
    .delete(protect, admin, deleteJob);

module.exports = router;
