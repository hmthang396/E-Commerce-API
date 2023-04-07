const express = require("express")
const multer = require("multer")
const colorController = require('../../controllers/server/Color.controller')
const { isEmpty, checkValidityOfInputData, isNumber } = require("../../utils/checkValidity")
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
        let result = await colorController.getAllColor();
        res.status(200).json({
            Data: result,
            ErrorCode: 0,
            Message: "Success",
        })
    } catch (error) {
        next(error);
    }

});

router.get("/:colorId", Authorization.isCustomer, async (req, res, next) => {
    try {
        let { colorId } = req.params;
        if (isEmpty("colorId", req.params)) { throw Error("Request Params is invalid"); }
        let result = await colorController.getColorById(colorId);
        res.status(200).json({
            Data: result,
            ErrorCode: 0,
            Message: "Success",
        })
    } catch (error) {
        next(error);
    }

});

router.post("/", Authorization.isManager, Authorization.isCreate, upload.array("files", 12), async (req, res, next) => {
    try {
        let images = req.files.map((image) => {
            return {
                src: image.filename
            }
        });
        let { color, productId, stock, price } = req.body;
        if (!checkValidityOfInputData(["productId", "color", "stock", "price"], req.body)) {
            throw Error("Request Body is invalid");
        }
        let result = await colorController.addColorForProduct({
            color: {
                color: color,
                price,
                stock
            },
            image: images.map(img => {
                return {
                    alt: color,
                    src: img.src
                }
            }),
            product: {
                id: productId
            }
        });
        res.status(201).json({
            Data: result,
            ErrorCode: 0,
            Message: "Success",
        })
    } catch (error) {
        next(error);
    }

});

router.put("/", Authorization.isManager, Authorization.isUpdate, async (req, res, next) => {
    try {
        let { color, colorId } = req.body;
        if (!checkValidityOfInputData(["colorId", "color"], req.body)) {
            throw Error("Request Body is invalid");
        }
        let result = await colorController.updateColor({
            id: colorId,
            color
        });
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
        let result = await colorController.deleteColorFromProduct(id);
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