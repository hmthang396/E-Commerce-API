const db = require('../../models/index');
const ENUM = require("../../config/Enum.model");
const bcrypt = require("bcrypt");
module.exports = {
    loginUser: async (para) => {
        let result = await db.User.findOne({
            where: {
                email: para.email
            }
        });
        if (result) {
            let check = await bcrypt.compare(para.password, result.password);
            return true;
        }
        return false;
    },
    loginAccount: async (para) => {
        let result = await db.Account.findOne({
            //attributes: { exclude: ['password'] },
            where: {
                email: para.email
            },
            include: db.Role,
        });
        if (result) {
            let check = await bcrypt.compare(para.password, result.password);
            if (check) {
                result.password = undefined;
                return JSON.parse(JSON.stringify(result));
            }
            return false;
        }
        return false;
    },
    getAccountByEmail: async (para) => {
        let result = await db.Account.findOne({
            attributes: { exclude: ["password"] },
            where: {
                email: para.email
            },
            include: db.Role,
            json:true
        });
        return result;
    }
};