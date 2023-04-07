const express = require("express");
const multer = require("multer");
const bcrypt = require("bcrypt");
const userController = require('../../controllers/client/User.controller');
const { checkValidityOfInputData } = require("../../utils/checkValidity");

var router = express.Router();
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./src/public/Product");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + parseInt(Math.random() * 10000000).toString() + "." + file.originalname.split(".")[1]);
    },
});
let upload = multer({ storage: storage });

router.post("/", upload.single("file"), async (req, res, next) => {
    try {
        let image = req?.file?.filename;
        let { fullname, email, password, phoneNumber } = req.body;
        if (!checkValidityOfInputData(["fullname", "email", "password", "phoneNumber"], req.body)) { throw Error("Request Body is invalid"); }
        const salt = await bcrypt.genSalt(10);
        let result = await userController.createUser({
            pic: image ? image : `https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg`,
            fullname,
            email,
            phoneNumber,
            password: await bcrypt.hash(password, salt)
        });
        return res.status(201).json({
            Data: result,
            ErrorCode: 0,
            Message: "Success",
        })
    } catch (error) {
        next(error);
    }
});

router.post("/login", async (req, res, next) => {
    try {
        let { email, password } = req.body;
        if (!checkValidityOfInputData(["email", "password"], req.body)) { throw Error("Request Body is invalid"); }
        let user = await userController.getUserByEmail(email);
        let checked = await bcrypt.compare(password, user.password);
        if (!user || !checked) {
            return res.status(200).json({
                Data: null,
                ErrorCode: 11,
                Message: "Email or Password is incorrect",
            })
        }
        delete user.password;
        return res.status(200).json({
            Data: user,
            ErrorCode: 0,
            Message: "Success",
        })
    } catch (error) {
        console.log(error);
        next(error);
    }
});


module.exports = router;