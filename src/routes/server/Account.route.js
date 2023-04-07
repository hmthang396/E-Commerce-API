const express = require("express")
const multer = require("multer")
const bcrypt = require("bcrypt")
const accountController = require('../../controllers/server/Account.controller')
const ENUM = require('../../config/Enum.model')
const { checkValidityOfInputData, isEmpty } = require("../../utils/checkValidity")
var router = express.Router()
let Authorization = require('../../middleware/Authorization')

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./src/public/Product");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + parseInt(Math.random() * 10000000).toString() + "." + file.originalname.split(".")[1]);
    },
});

let upload = multer({ storage: storage });

router.get("/:id", async (req, res, next) => {
    try {
        let { id } = req.params;
        if (isEmpty("id", req.params)) { throw Error("Request Params is invalid"); }
        let result = await accountController.getAccountById(id);
        return res.status(200).json({
            Data: result,
            ErrorCode: 0,
            Message: "Success",
        })
    } catch (error) {
        next(error);
    }

});
// Authorization.isCreate,
router.post("/",  upload.single("file"), async (req, res, next) => {
    try {
        let image = req?.file?.filename;
        let { fullname, email, password, position, roleCreate, roleUpdate, roleDelete, roleAddDiscount } = req.body;
        if (!checkValidityOfInputData(["fullname", "email", "password", "position", "roleCreate", "roleUpdate", "roleDelete", "roleAddDiscount"], req.body)) {
            throw Error("Request Body is invalid");
        }
        const salt = await bcrypt.genSalt(10);
        let result = await accountController.createAccount({
            pic: image ? image : `https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg`,
            fullname,
            email,
            password: await bcrypt.hash(password, salt),
            position: position ? position : ENUM.ENUM_POSITION[1],
            create: roleCreate ? roleCreate : false,
            update: roleUpdate ? roleUpdate : false,
            delete: roleDelete ? roleDelete : false,
            addDiscount: roleAddDiscount ? roleAddDiscount : false,
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

module.exports = router;