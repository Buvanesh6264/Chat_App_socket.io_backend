const express = require("express");
const {registerUser } = require("../controller/userController");
const router = express.Router();

router.get("/" , (req,res) =>{
    res.send("getting user")
});

router.post("/register" , registerUser);

module.exports = router;