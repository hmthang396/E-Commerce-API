const express = require("express");
let router = express.Router();
const dashboardController = require('../../controllers/server/Dashboard.controller')
let Authorization = require('../../middleware/Authorization')
router.get("/NumberOrder", Authorization.isCustomer, async (req, res, next) => {
    try {
        let result = await dashboardController.getNumberOfOrder();
        return res.status(200).json({
            Data: result,
            ErrorCode: 0,
            Message: "Success",
        });
    } catch (error) {
        next(error);
    }
})

router.get("/NumberProductByCategory", Authorization.isCustomer, async (req, res, next) => {
    try {
        let result = await dashboardController.getTotalNumberProductByCategory();
        return res.status(200).json({
            Data: result,
            ErrorCode: 0,
            Message: "Success",
        });
    } catch (error) {
        next(error);
    }
})

router.get("/NumberProductBySubCategory", Authorization.isCustomer, async (req, res, next) => {
    try {
        let result = await dashboardController.getTotalNumberProductBySubCatrgory();
        return res.status(200).json({
            Data: result,
            ErrorCode: 0,
            Message: "Success",
        });
    } catch (error) {
        next(error);
    }
})

router.get("/NumberProduct/:categoryId", Authorization.isCustomer, async (req, res, next) => {
    try {
        const { categoryId } = req.params;
        let result = await dashboardController.getTotalNumberProduct(categoryId);
        return res.status(200).json({
            Data: result,
            ErrorCode: 0,
            Message: "Success",
        });
    } catch (error) {
        next(error);
    }
})
module.exports = router;