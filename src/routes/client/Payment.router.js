const express = require("express");
const { isEmpty } = require("../../utils/checkValidity");
const { captureOrder, generateAccessToken } = require("../../utils/payment");
let router = express.Router();

router.get("/paypal", async (req, res, next) => {
    try {
        let { token, PayerID } = req.query;
        if (isEmpty("token", req.query) && isEmpty("PayerID", req.query)) { throw Error("Request Query is invalid"); }
        let access_token = await generateAccessToken();
        let data = await captureOrder(token, access_token);
        if (data.status === "COMPLETED") {
            res.redirect(`${process.env.URL_PAGE}/page/account/order-success/${token}`);
        } else {
            res.status(200).json({
                Data: null,
                ErrorCode: 0,
                Message: "Error",
            });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
})

module.exports = router;