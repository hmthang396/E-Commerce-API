const express = require("express");
const brandController = require('../../controllers/client/Brand.controller');
let router = express.Router();

router.get(`/`, async (req, res, next) => {
    try {
        let brands = await brandController.getAllBrand();
        return res.status(200).json({
            Data: brands,
            ErrorCode: 0,
            Message: "Success",
        })
    } catch (error) {
        next(error);
    }
});

module.exports = router;