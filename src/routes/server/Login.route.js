const express = require("express");
const multer = require("multer");
const jwt = require('jsonwebtoken')
const loginController = require('../../controllers/server/Login.controller');
const { isEmpty } = require("../../utils/checkValidity");
let router = express.Router();

router.post("/", async (req, res, next) => {
    try {
        let { email, password } = req.body;
        if (isEmpty("email", req.body) || isEmpty("password", req.body)) { throw Error("Request Body is invalid"); }
        let result = await loginController.loginAccount({ email, password });
        if (result) {
            const account = {
                email: result.email,
                position: result.position,
                role: result.Roles
            }
            const token = jwt.sign(account, process.env.SECRET, { expiresIn: process.env.tokenLife });
            const refreshToken = jwt.sign(account, process.env.SECRET_REFRESH, { expiresIn: process.env.refreshTokenLife })
            return res.status(200).json({
                Data: {
                    ...result,
                    accessToken: token,
                    refreshToken
                },
                ErrorCode: 0,
                Message: "Success",
            })
        }
        return res.status(200).json({
            Data: null,
            ErrorCode: 1,
            Message: "Login failed",
        })
    } catch (error) {
        next(error);
    }

});

router.post('/token', async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (isEmpty("refreshToken", req.body)) { throw Error("Request Body is invalid"); }
        let email = null;
        jwt.verify(refreshToken, process.env.SECRET_REFRESH, function (err, decoded) {
            if (err) {
                return res.status(400).json({
                    Data: null,
                    ErrorCode: 3,
                    Message: 'Token is invalid.'
                });
            }
            email = decoded.email;
        });
        if (email) {
            let result = await loginController.getAccountByEmail({ email });
            const account = {
                email: result.email,
                position: result.position,
                role: result.Roles
            }
            const token = jwt.sign(account, process.env.SECRET, { expiresIn: process.env.tokenLife });
            return res.status(200).send({
                Data: { accessToken: token, },
                ErrorCode: 0,
                Message: 'Success'
            });
        }else{
            return res.status(200).send({
                Data: { accessToken: token, },
                ErrorCode: 2,
                Message: 'Get new access token failed'
            });
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;