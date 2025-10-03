const express = require("express")
const { getNews, getNewsById, createNews, updateNews, deleteNews } = require("../controllers/newsController")
const { protect, admin } = require("../middleware/auth")
const { upload } = require("../utils/upload")

const router = express.Router()

router.get("/", getNews)
router.get("/:id", getNewsById)

// Admin only routes
router.post("/", protect, admin, ...upload.news(), createNews)
router.put("/:id", protect, admin, ...upload.news(), updateNews)
router.delete("/:id", protect, admin, deleteNews)

module.exports = router
