const express = require("express")
const { getNews, getNewsById, createNews, updateNews, deleteNews } = require("../controllers/newsController")
const { protect, admin, authorize } = require("../middleware/auth")
const { upload } = require("../utils/upload")

const router = express.Router()

router.get("/", getNews)
router.get("/:id", getNewsById)

// Admin and Publisher routes
router.post("/", protect, authorize("admin", "publisher"), ...upload.news(), createNews)
router.put("/:id", protect, authorize("admin", "publisher"), ...upload.news(), updateNews)
router.delete("/:id", protect, admin, deleteNews)

module.exports = router
