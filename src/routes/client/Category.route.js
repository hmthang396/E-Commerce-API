const express = require("express");
const categoryController = require('../../controllers/client/Category.controller');
let router = express.Router();

router.get("/all", async (req, res, next) => {
    try {
        const result = await categoryController.getAllCategory();
        res.status(200).json({
            Data: result,
            ErrorCode: 0,
            Message: "Success",
        })
    } catch (error) {
        console.log(error);
        next(error);
    }
});

module.exports = router;