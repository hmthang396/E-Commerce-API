const express = require("express")
const orderController = require('../../controllers/server/Order.controller')
const detailOrderController = require('../../controllers/server/DetailOrder.controller')
let router = express.Router()
let Authorization = require('../../middleware/Authorization')

router.get("/all", Authorization.isCustomer, async (req, res, next) => {
    try {
        let result = await orderController.getAllOrder();
        return res.status(200).json({
            Data: result,
            ErrorCode: 0,
            Message: "Success",
        });
    } catch (error) {
        next(error);
    }

});

router.put("/", Authorization.isManager, Authorization.isUpdate, async (req, res, next) => {
    try {
        let { status, code } = req.body;
        if (isEmpty("status", req.body) || isEmpty("code", req.body)) { throw Error("Request Body is invalid"); }
        let result;
        if (status === "Hoàn thành") {
            result = await orderController.updateStatus({ status, code, isCheckout: true });
        } else {
            result = await orderController.updateStatus({ status, code });
        }
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