const db = require('../../models/index');
const ENUM = require("../../config/Enum.model");
module.exports = {
    getBrandById : async(para)=>{
        let result = await db.Brand.findOne({
            where:{
                id:para
            }
        });
        return result;
    },
    createBrand : async(para)=>{
        let result = await db.Brand.create(para);
        return result;
    },
    updateBrand : async(para)=>{
        let result = await db.Brand.update(para,{
            where : {
                id: para.id
            }
        });
        return result;
    },
    deleteBrand : async(para)=>{
        let result = await db.Brand.destroy({
            where:{
                id:para
           }
        });
        return result;
    },
    getAllBrand:async()=>{
        let result = await db.Brand.findAll();
        return result;
    }
};