const express = require("express")
const router = express.Router()
const { getPrivileges, createPrivilege, updatePrivilege, deletePrivilege } = require("../controllers/privilegeController")
const { protect, authorize } = require("../middleware/auth")
const { upload } = require("../utils/upload")

router
    .route("/")
    .get(getPrivileges)
    .post(protect, authorize("admin", "partnership_manager"), ...upload.single("logo", "default"), createPrivilege)

router
    .route("/:id")
    .put(protect, authorize("admin", "partnership_manager"), ...upload.single("logo", "default"), updatePrivilege)
    .delete(protect, authorize("admin", "partnership_manager"), deletePrivilege)

module.exports = router
