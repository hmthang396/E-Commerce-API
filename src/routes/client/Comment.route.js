const express = require("express")
const commentController = require('../../controllers/client/Comment.controller')
const { checkValidityOfInputData } = require("../../utils/checkValidity")
let router = express.Router();

router.get("/all", async (req, res, next) => {
    try {
        const { page, limit, productId,userId } = req.query;
        if (!checkValidityOfInputData(["page", "limit", "productId","userId"], req.query)) { throw Error("Request Params is invalid"); }
        const result = await commentController.getAllCommentByProductId({ page, limit, productId,userId });
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

router.post("/", async (req, res, next) => {
    try {
        let { content, productId, userId } = req.body;
        if (!checkValidityOfInputData(["content", "productId", "userId"], req.body)) { throw Error("Request Body is invalid"); }
        let result = await commentController.createComment({ content, productId, userId });
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

module.exports = router;