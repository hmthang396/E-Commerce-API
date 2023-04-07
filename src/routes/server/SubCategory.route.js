const express = require("express")
const subCategoryController = require('../../controllers/server/SubCategory.controller')
let router = express.Router()
const db = require('../../models/index')
const { isEmpty } = require("../../utils/checkValidity")
let Authorization = require('../../middleware/Authorization')

router.get("/all", Authorization.isCustomer, async (req, res, next) => {
    try {
        let result = await db.SubCategory.findAll({
            include: [db.Category]
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

router.get("/all/:categoryId", Authorization.isCustomer, async (req, res, next) => {
    try {
        let { categoryId } = req.params;
        if (isEmpty("categoryId", req.params)) { throw Error("Request Params is invalid"); }
        let result = await subCategoryController.getAllSubCategory(categoryId);
        res.status(200).json({
            Data: result,
            ErrorCode: 0,
            Message: "Success",
        })
    } catch (error) {
        next(error);
    }

});

router.get("/:subCategoryId", Authorization.isCustomer, async (req, res, next) => {
    try {
        let { subCategoryId } = req.params;
        if (isEmpty("subCategoryId", req.params)) { throw Error("Request Params is invalid"); }
        let result = await subCategoryController.getSubCategoryById(subCategoryId);
        res.status(200).json({
            Data: result,
            ErrorCode: 0,
            Message: "Success",
        })
    } catch (error) {
        next(error);
    }

});

router.post("/", Authorization.isManager, Authorization.isCreate, async (req, res, next) => {
    try {
        let { title, categoryId } = req.body;
        if (isEmpty("categoryId", req.body) || isEmpty("title", req.body)) { throw Error("Request Body is invalid"); }
        let result = await subCategoryController.createSubCategory({ title, categoryId });
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
        let { subCategoryId, title } = req.body;
        if (isEmpty("subCategoryId", req.body) || isEmpty("title", req.body)) { throw Error("Request Body is invalid"); }
        let result = await subCategoryController.updateSubCategory({ title, id: subCategoryId });
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
        let result = await subCategoryController.deleteSubCategory(id);
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