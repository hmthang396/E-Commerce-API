const express = require("express");
const multer = require("multer");
const bcrypt = require("bcrypt");
const userController = require('../controllers/User.controller');
const ENUM = require('../../config/Enum.model');
var router = express.Router();
let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./src/public/Product");
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + parseInt(Math.random()*10000000).toString() + "." + file.originalname.split(".")[1]);
    },
});
let upload = multer({ storage: storage });
router.post("/", upload.single("file"),async (req, res) => {
    let image = req?.file?.filename;
    let {fullname,email,password} = req.body;
    const salt = await bcrypt.genSalt(10);
    let result = await userController.createUser({
        pic:image ? image : `https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg`,
        fullname,
        email,
        password : await bcrypt.hash(password, salt)
    });
    res.json({
        Data: result,
        ErrorCode: 0,
        Message: "",
    })
});