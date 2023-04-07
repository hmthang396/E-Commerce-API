const express = require("express")
const multer = require("multer")
const imageController = require('../../controllers/server/Image.controller');
const { isEmpty, checkValidityOfInputData } = require("../../utils/checkValidity");
let router = express.Router()
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

router.get("/all", Authorization.isCustomer, async (req, res, next) => {
    try {
        let result = await imageController.getAllImage();
        res.status(200).json({
            Data: result,
            ErrorCode: 0,
            Message: "Success",
        })
    } catch (error) {
        next(error);
    }

});

router.get("/:imageId", Authorization.isCustomer, async (req, res, next) => {
    try {
        let { imageId } = req.params;
        if (isEmpty("imageId", req.params)) { throw Error("Request Params is invalid"); }
        let result = await imageController.getImageById(imageId);
        res.status(200).json({
            Data: result,
            ErrorCode: 0,
            Message: "Success",
        })
    } catch (error) {
        next(error);
    }

});

router.post("/", Authorization.isManager, Authorization.isCreate, upload.single("file"), async (req, res, next) => {
    try {
        let image = req?.file?.filename;
        let { colorId, productId } = req.body;
        if (!checkValidityOfInputData(["colorId", "productId"], req.body)) {
            throw Error("Request Body is invalid");
        }
        let result = await imageController.createImage({ colorId, productId, image });
        res.status(201).json({
            Data: result,
            ErrorCode: 0,
            Message: "Success",
        })
    } catch (error) {
        next(error);
    }

});

router.put("/", Authorization.isManager, Authorization.isUpdate, upload.single("file"), async (req, res, next) => {
    try {
        let image = req?.file?.filename;
        let { imageId } = req.body;
        if (!checkValidityOfInputData(["imageId"], req.body)) {
            throw Error("Request Body is invalid");
        }
        let result = await imageController.updateImage({imageId,image});
        res.status(200).json({
            Data: result,
            ErrorCode: 0,
            Message: "Success",
        })
    } catch (error) {
        next(error);
    }

});

router.delete("/", Authorization.isAdministrator, Authorization.isDelete, async (req, res, next) => {
    try {
        const { id } = req.body;
        if (isEmpty("id", req.body)) {
            throw Error("Request Body is invalid");
        }
        let result = await imageController.deleteImage(id);
        res.status(200).json({
            Data: result,
            ErrorCode: 0,
            Message: "Success",
        })
    } catch (error) {
        next(error);
    }

});

module.exports = router;