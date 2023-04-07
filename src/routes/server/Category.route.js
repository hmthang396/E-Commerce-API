const express = require("express")
const categoryController = require('../../controllers/server/Category.controller')
const { isEmpty } = require("../../utils/checkValidity")
let router = express.Router()
let Authorization = require('../../middleware/Authorization')

router.get("/all", Authorization.isCustomer, async (req, res, next) => {
    try {
        let result = await categoryController.getAllCategory();
        res.status(200).json({
            Data: result,
            ErrorCode: 0,
            Message: "Success",
        })
    } catch (error) {
        next(error);
    }

});

router.get("/:categoryId", Authorization.isCustomer, async (req, res, next) => {
    try {
        let { categoryId } = req.params;
        if (isEmpty("categoryId", req.params)) { throw Error("Request Params is invalid"); }
        let result = await categoryController.getCategodyById(categoryId);
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
        let { title } = req.body;
        if (isEmpty("title", req.body)) { throw Error("Request Body is invalid"); }
        let result = await categoryController.createCategory({ title });
        res.status(201).json({
            Data: result,
            ErrorCode: 0,
            Message: "Success",
        })
    } catch (error) {
        console.log(error);
        next(error);
    }

});

router.put("/", Authorization.isManager, Authorization.isUpdate, async (req, res, next) => {
    try {
        let { categoryId, title } = req.body;
        if (isEmpty("title", req.body) || isEmpty("categoryId", req.body)) { throw Error("Request Body is invalid"); }
        let result = await categoryController.updateCatagory({ title, id: categoryId });
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
        let result = await categoryController.deleteCategory(id);
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