const db = require('../../models/index');
const ENUM = require("../../config/Enum.model");
const bcrypt = require("bcrypt");
module.exports = {
    createAccount : async(para)=>{
        let result = await db.Role.create(
            {
                create:para.create,
                update:para.update,
                delete:para.delete,
                addDiscount:para.addDiscount,
                Accounts:{
                    ...para,
                }
            },
            {
                include:db.Account
            }
        );
        return result;
    },
    getAccountById: async(para)=>{
        let result = await db.Account.findOne({
            where:{
                id:para
            },
            include:db.Role
        });
        return result;
    },
};