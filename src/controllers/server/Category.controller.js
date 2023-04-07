const db = require('../../models/index');
const ENUM = require("../../config/Enum.model");
module.exports = {
    getCategodyById:async(para)=>{
        let result = await db.Category.findOne({
            where:{
                id:parseInt(para)
            },
            include:[db.SubCategory]
        });
        return result;
    },

    getAllCategory:async(para)=>{
        let result = await db.Category.findAll({
        });
        return result;
    },

    createCategory:async(para)=>{
        let result = await db.Category.create(para);
        return result;
    },

    updateCatagory : async(para)=>{
        let result = await db.Category.update(para,{
            where:{
                id: para.id
            }
        });
        return result;
    },
    deleteCategory : async(para)=>{
        let result = await db.Category.destroy({
            where:{
                id:para
           }
        });
        return result;
    },
};