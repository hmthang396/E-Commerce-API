const express = require("express");
const { getGoogleOauthToken, getGoogleUser } = require("../../utils/accessGoogleOAuth");
const userController = require('../../controllers/client/User.controller');
const { getFacebookOauthToken, getFacebookUser } = require("../../utils/accessFacebookOAuth");
let router = express.Router();

router.get('/google', async (req, res, next) => {
    const { code } = req.query;
    if (!code) {
        return res.status(401).send({
            Data: null,
            ErrorCode: 12,
            Message: 'Authorization code not provided!'
        });
    }
    // Use the code to get the id and access tokens
    const dataGoogleOauthToken = await getGoogleOauthToken({ code });
    let { id_token, access_token } = dataGoogleOauthToken.data
    // Use the token to get the User
    const resultGoogleUser = await getGoogleUser({ id_token, access_token });
    const { name, verified_email, email, picture } = resultGoogleUser.data;
    // Check if user is verified
    if (!verified_email) {
        return res.status(403).send({
            Data: null,
            ErrorCode: 13,
            Message: 'Google account not verified'
        });
    }
    // Update user if user already exist or create new user
    const user = await userController.getUserByEmail(email);
    if (!user) {
        let result = await userController.createUser({
            pic: picture,
            fullname: name,
            email: email,
        });
        return res.status(200).json({
            Data: result,
            ErrorCode: 0,
            Message: "Success",
        })
    }
    delete user.password;
    return res.status(200).json({
        Data: user,
        ErrorCode: 0,
        Message: "Success",
    })
});

router.get('/facebook', async (req, res, next) => {
    const { code } = req.query;
    if (!code) {
        return res.status(401).send({
            Data: null,
            ErrorCode: 12,
            Message: 'Authorization code not provided!'
        });
    }
    // Use the code to get the id and access tokens
    const dataFacebookOauthToken = await getFacebookOauthToken({ code });
    let { token_type, access_token } = dataFacebookOauthToken.data
    // Use the token to get the User
    const resultGoogleUser = await getFacebookUser({ token_type, access_token });

    // Check if user is verified

    // Update user if user already exist or create new user

    return res.status(200).json({
        Data: {
            pic: resultGoogleUser.data.picture.data.url,
            fullname: resultGoogleUser.data.name,
            id: resultGoogleUser.data.id
        },
        ErrorCode: 0,
        Message: "Success",
    })
});
module.exports = router;