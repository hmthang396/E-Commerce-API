const express = require("express")
const multer = require("multer")
const productController = require('../../controllers/server/Product.controller')
const ENUM = require('../../config/Enum.model')
const { isNumber, isEmpty, checkValidityOfInputData } = require("../../utils/checkValidity")
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
        const result = await productController.getAllProduct();
        res.status(200).json({
            Data: result,
            ErrorCode: 0,
            Message: "Success",
        })
    } catch (error) {
        next(error);
    }
});

router.get("/:productId", Authorization.isCustomer, async (req, res, next) => {
    try {
        const { productId } = req.params;
        if (isEmpty("productId", req.params) || !isNumber(productId)) { throw Error("Request Params is invalid"); }
        const result = await productController.getProductById(productId);
        res.status(200).json({
            Data: result,
            ErrorCode: 0,
            Message: "Success",
        })
    } catch (error) {
        next(error);
    }
});

router.get("/:productId/:colorId", Authorization.isCustomer, async (req, res, next) => {
    try {
        const { productId, colorId } = req.params;
        if (isEmpty("productId", req.params) || isEmpty("colorId", req.params)) { throw Error("Request Params is invalid"); }
        const result = await productController.getProductByIdAndColor({ colorId, productId });
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
        let { title, description, price, sale, stock, news, subCategoryId, brandId, categoryId, collectionId, color, tags,type } = req.body;
        if (!checkValidityOfInputData(["title", "description", "price", "sale", "stock", "news", "subCategoryId", "brandId", "categoryId", "collectionId", "color", "tags","type"], req.body)) {
            throw Error("Request Body is invalid");
        }
        const result = await productController.createProduct({
            product: {
                title,
                description,
                status: sale,
                isNew: news,
                type,
                subCategoryId,
                brandId,
                categoryId,
                collectionId,
            },
            color: {
                color: color,
                price,
                stock,
            },
            image: images.map(img => {
                return {
                    alt: color,
                    src: img.src
                }
            }),
            tag: tags.toString().split(' ').map(tag => {
                return {
                    title: tag
                }
            })
        });
        res.status(201).json({
            Data: result,
            ErrorCode: 0,
            Message: "Success",
        });
    } catch (error) {
        next(error);
    }
});

router.put("/addDiscount", Authorization.isManager, Authorization.isUpdate, Authorization.isAddDiscount, async (req, res, next) => {
    try {
        let { productId, discountId } = req.body;
        if (isEmpty("productId", req.body) || isEmpty("discountId", req.body) || !isNumber(productId) || !isNumber(discountId)) { throw Error("Request Params is invalid"); }
        const result = await productController.updateDiscountForProduct({ productId, discountId });
        res.status(200).json({
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
        let { title, description, price, sale, stock, news, productId, colorId, categoryId, subCategoryId, brandId, collectionId, color,type } = req.body;
        if (!checkValidityOfInputData(["title", "description", "price", "type","sale", "stock", "news", "productId", "colorId", "color", "categoryId", "subCategoryId", "brandId", "collectionId"], req.body)) {
            throw Error("Request Body is invalid");
        }
        const result = await productController.updateProduct({
            product: {
                title, description, status: sale, isNew: news, id: productId,subCategoryId,brandId,categoryId,collectionId,type
            },
            color: {
                color: color, price, stock, id: colorId
            }
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
        let { id } = req.body;
        if (isEmpty("id", req.body) || !isNumber(id)) {
            throw Error("Request Body is invalid");
        }
        const result = await productController.deleteProductById(id);
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