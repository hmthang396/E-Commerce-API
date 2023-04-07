const express = require("express");
const likeController = require('../../controllers/client/Like.controller')
const { checkValidityOfInputData } = require("../../utils/checkValidity")

var router = express.Router();
router.post("/", async (req, res, next) => {
    try {
        let { like, dislike, commentId, userId } = req.body;
        if (!checkValidityOfInputData(["like", "dislike", "commentId", "userId"], req.body)) { throw Error("Request Body is invalid"); }
        let result = await likeController.createLike({ like, commentId, userId, dislike });
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