const express = require("express")
const brandController = require('../../controllers/server/Brand.controller')
const { isEmpty } = require("../../utils/checkValidity")
let router = express.Router()
let Authorization = require('../../middleware/Authorization')

const multer = require("multer")
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./src/public/Icon");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + parseInt(Math.random() * 10000000).toString() + "." + file.originalname.split(".")[1]);
    },
});
let upload = multer({ storage: storage });

router.get("/all", Authorization.isCustomer, async (req, res, next) => {
    try {
        let result = await brandController.getAllBrand();
        res.status(200).json({
            Data: result,
            ErrorCode: 0,
            Message: "Success",
        })
    } catch (error) {
        next(error);
    }

});

router.get("/:brandId", Authorization.isCustomer, async (req, res, next) => {
    try {
        let { brandId } = req.params;
        if (isEmpty("brandId", req.params)) { throw Error("Request Params is invalid"); }
        let result = await brandController.getBrandById(brandId);
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
        let { title } = req.body;
        if (isEmpty("title", req.body)) { throw Error("Request Body is invalid"); }
        let result = await brandController.createBrand({ title, icon: image });
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
        let { brandId, title } = req.body;
        if (isEmpty("brandId", req.body) || isEmpty("title", req.body)) { throw Error("Request Body is invalid"); }
        let result = await brandController.updateBrand({ title, id: brandId, icon: image });
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
        let { id } = req.body;
        if (isEmpty("id", req.body)) { throw Error("Request Body is invalid"); }
        let result = await brandController.deleteBrand(id);
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