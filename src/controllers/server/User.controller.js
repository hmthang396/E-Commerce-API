const db = require('../../models/index');
const ENUM = require("../../config/Enum.model");
const bcrypt = require("bcrypt");
module.exports = {
    createUser : async(para)=>{
        let result = await db.User.create(para);
        return result;
    },
    getUserById: async(para)=>{
        let result = await db.User.findOne({
            where:{
                id:para
            }
        });
        return result;
    },
};