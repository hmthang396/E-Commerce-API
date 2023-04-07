const express = require("express")
const discountController = require('../../controllers/server/Discount.controller')
const { checkValidityOfInputData, isEmpty } = require("../../utils/checkValidity")
let router = express.Router()
let Authorization = require('../../middleware/Authorization')

router.get("/all", Authorization.isCustomer, async (req, res, next) => {
    try {
        let result = await discountController.getAllDiscount();
        return res.status(200).json({
            Data: result,
            ErrorCode: 0,
            Message: "Success",
        })
    } catch (error) {
        next(error);
    }

});

router.get("/allIsEnable", Authorization.isCustomer, async (req, res, next) => {
    try {
        let result = await discountController.getAllDiscount({ status: true });
        return res.status(200).json({
            Data: result,
            ErrorCode: 0,
            Message: "Success",
        })
    } catch (error) {
        next(error);
    }

});

router.get("/:discountId", Authorization.isCustomer, async (req, res, next) => {
    try {
        let { discountId } = req.params;
        if (isEmpty("discountId", req.params)) { throw Error("Request Params is invalid"); }
        let result = await discountController.getDiscountById(discountId);
        return res.status(200).json({
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
        let { discount, beginAt, endAt } = req.body;
        if (!checkValidityOfInputData(["discount", "beginAt", "endAt"], req.body)) {
            throw Error("Request Body is invalid");
        }
        let result = await discountController.createDiscount({ discount, beginAt, endAt });
        return res.status(201).json({
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
        let { discountId, discount, beginAt, endAt } = req.body;
        if (!checkValidityOfInputData(["discount", "beginAt", "endAt", "discountId"], req.body)) {
            throw Error("Request Body is invalid");
        }
        const checkStatus = (parameter, start, end) => {
            let timeNow, timeStart, timeEnd;
            timeStart = new Date(start).getTime();
            timeEnd = new Date(end).getTime();
            if (!parameter) {
                timeNow = new Date().getTime();
            } else {
                timeNow = new Date(parameter).getTime();
            }
            if (timeNow < timeEnd && timeNow > timeStart) return true;
            return false;
        }

        let result = await discountController.updateDiscount({ discount, status: checkStatus(null, beginAt, endAt), beginAt, endAt, id: discountId });
        return res.status(200).json({
            Data: result,
            ErrorCode: 0,
            Message: "Success",
        })
    } catch (error) {
        console.log(error);
        next(error);
    }

});

router.delete("/", Authorization.isAdministrator, Authorization.isDelete, async (req, res, next) => {
    try {
        let { id } = req.body;
        if (isEmpty("id", req.body)) { throw Error("Request Body is invalid"); }
        let result = await discountController.deleteDiscount(id);
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