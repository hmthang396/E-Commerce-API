const express = require("express");
const productController = require('../../controllers/client/Product.controller');
const ENUM = require('../../config/Enum.model');
const { isEmpty } = require("../../utils/checkValidity");
let router = express.Router();

router.get("/top", async (req, res, next) => {
    try {
        const { page, limit, type } = req.query;
        if (isEmpty("page", req.query) && isEmpty("limit", req.query) && isEmpty("type", req.query)) { throw Error("Request Query is invalid"); }
        if (type === 'bestsell') {
            const result = await productController.getProductSortByOrder({ page, limit });
            return res.status(200).json({
                Data: result,
                ErrorCode: 0,
                Message: "Success",
            })
        }
        if (type === 'bestprice') {
            const result = await productController.getProductSortByPrice({ page, limit });
            return res.status(200).json({
                Data: result,
                ErrorCode: 0,
                Message: "Success",
            })
        }
        return res.status(200).json({
            Data: null,
            ErrorCode: 0,
            Message: "Success",
        })
    } catch (error) {
        console.log(error);
        next(error);
    }
});
router.get("/tag/:tag", async (req, res, next) => {
    try {
        const { tag } = req.params;
        if (isEmpty("tag", req.params)) { throw Error("Request Params is invalid"); }
        const result = await productController.getProductByTags(tag);
        res.status(200).json({
            Data: result,
            ErrorCode: 0,
            Message: "Success",
        })
    } catch (error) {
        next(error);
    }
});
router.get("/search", async (req, res, next) => {
    try {
        const { page, limit, subCategory, collection, type, category } = req.query;
        if (isEmpty("subCategory", req.query)) { throw Error("Request Query is invalid"); }
        const result = await productController.getProduct({ page, limit, subCategory, collection, type, category });
        res.status(200).json({
            Data: result,
            ErrorCode: 0,
            Message: "Success",
        })
    } catch (error) {
        next(error);
    }
});
router.get("/find", async (req, res, next) => {
    try {
        const { key } = req.query;
        if (isEmpty("key", req.query)) { throw Error("Request Query is invalid"); }
        const result = await productController.getProductByKey(key);
        res.status(200).json({
            Data: result,
            ErrorCode: 0,
            Message: "Success",
        })
    } catch (error) {
        next(error);
    }
});
router.get("/new", async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        if (isEmpty("page", req.query) && isEmpty("limit", req.query)) { throw Error("Request Query is invalid"); }
        const result = await productController.getProductByNew({ page, limit });
        return res.status(200).json({
            Data: result,
            ErrorCode: 0,
            Message: "Success",
        })
    } catch (error) {
        next(error);
    }
});
router.get("/collection", async (req, res, next) => {
    try {
        const { productId, page, limit } = req.query;
        if (isEmpty("page", req.query) && isEmpty("limit", req.query) && isEmpty("productId", req.query)) { throw Error("Request Query is invalid"); }
        const result = await productController.getProductByCollection({ page, limit, productId });
        return res.status(200).json({
            Data: result,
            ErrorCode: 0,
            Message: "Success",
        })
    } catch (error) {
        next(error);
    }
});
router.get("/all", async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        if (isEmpty("page", req.query) && isEmpty("limit", req.query)) { throw Error("Request Query is invalid"); }
        const result = await productController.getAllProduct({ page, limit });
        res.status(200).json({
            Data: result,
            ErrorCode: 0,
            Message: "Success",
        })
    } catch (error) {
        next(error);
    }
});
router.get("/:productId", async (req, res, next) => {
    try {
        const { productId } = req.params;
        if (isEmpty("productId", req.params)) { throw Error("Request Params is invalid"); }
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

module.exports = router;