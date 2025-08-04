const express = require("express")
const {createUser,loginUser, getAllUsers, deleteUser} = require("../controllers/userController")
const requireAuth = require("../middleware/requireAuth")

const router = express.Router()


router.post("/signup",createUser)
router.post("/login",loginUser)
router.get("/getallusers",requireAuth,getAllUsers)
router.delete("/deleteuser/:id",requireAuth,deleteUser)






module.exports = router;