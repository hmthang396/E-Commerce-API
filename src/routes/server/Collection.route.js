const express = require("express");
const collectionController = require('../../controllers/server/Collection.controller');
const { isEmpty } = require("../../utils/checkValidity");
var router = express.Router();

router.get("/all", async (req, res, next) => {
    try {
        let result = await collectionController.getAllCollection();
        return res.status(200).json({
            Data: result,
            ErrorCode: 0,
            Message: "Success",
        })
    } catch (error) {
        next(error);
    }

});
router.get("/all/:brandId", async (req, res, next) => {
    try {
        let { brandId } = req.params;
        if (isEmpty("brandId", req.params)) { throw Error("Request Params is invalid"); }
        let result = await collectionController.getAllCollectionByBrandId(brandId);
        return res.status(200).json({
            Data: result,
            ErrorCode: 0,
            Message: "Success",
        })
    } catch (error) {
        next(error);
    }

});

router.get("/:collectionId", async (req, res, next) => {
    try {
        let { collectionId } = req.params;
        if (isEmpty("collectionId", req.params)) { throw Error("Request Params is invalid"); }
        let result = await collectionController.getCollectionById(collectionId);
        return res.status(200).json({
            Data: result,
            ErrorCode: 0,
            Message: "Success",
        })
    } catch (error) {
        next(error);
    }

});

router.post("/", async (req, res, next) => {
    try {
        let { title, brandId } = req.body;
        if (isEmpty("brandId", req.body) || isEmpty("title", req.body)) { throw Error("Request Body is invalid"); }
        let result = await collectionController.createCollection({ title, brandId });
        return res.status(201).json({
            Data: result,
            ErrorCode: 0,
            Message: "Success",
        })
    } catch (error) {
        next(error);
    }

});

router.put("/", async (req, res, next) => {
    try {
        let { collectionId, title } = req.body;
        if (isEmpty("collectionId", req.body) || isEmpty("title", req.body)) { throw Error("Request Body is invalid"); }
        let result = await collectionController.updateCollection({ title, id: collectionId });
        return res.status(200).json({
            Data: result,
            ErrorCode: 0,
            Message: "Success",
        })
    } catch (error) {
        next(error);
    }

});

router.delete("/", async (req, res, next) => {
    try {
        let { id } = req.body;
        if (isEmpty("id", req.body)) { throw Error("Request Body is invalid"); }
        let result = await collectionController.deleteCollection(id);
        return res.status(200).json({
            Data: result,
            ErrorCode: 0,
            Message: "Success",
        })
    } catch (error) {
        next(error);
    }

});
module.exports = router;