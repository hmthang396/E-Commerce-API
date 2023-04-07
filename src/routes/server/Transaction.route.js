const express = require("express");
let router = express.Router();
const detailOrderController = require('../../controllers/server/DetailOrder.controller')
let Authorization = require('../../middleware/Authorization')

router.get("/all", Authorization.isCustomer, async (req, res, next) => {
    try {
        let result = await detailOrderController.getAllDetailOrder();
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