const jwt = require('jsonwebtoken')
const { getAccountByEmail } = require('../controllers/server/Login.controller');

const Authentication = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, process.env.SECRET, function (err, decoded) {
            if (err) {
                return res.status(401).json({
                    Data: null,
                    ErrorCode: 7,
                    Message: 'Unauthorized access'
                });
            }
            getAccountByEmail({ email: decoded.email })
                .then((data) => {
                    if (data) {
                        req.Authentication = {
                            email: data.email,
                            position: data.position,
                            role: data.Role.dataValues
                        };
                        next();
                    } else {
                        return res.status(401).send({
                            Data: null,
                            ErrorCode: 7,
                            Message: 'Unauthorized access'
                        });
                    }
                })
                .catch((error) => {
                    return res.status(401).send({
                        Data: null,
                        ErrorCode: 7,
                        Message: 'Unauthorized access'
                    });
                })
        });
    } else {
        return res.status(403).send({
            Data: null,
            ErrorCode: 6,
            Message: 'No token provided'
        });
    }
};



module.exports = Authentication;