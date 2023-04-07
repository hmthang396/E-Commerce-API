const db = require('../../models/index');
const ENUM = require("../../config/Enum.model");
module.exports = {
    createCollection:async(para)=>{
        let result = await db.Collection.create(para);
        return result;
    },
    updateCollection:async(para)=>{
        let result = await db.Collection.update(para,{
            where:{
                id: para.id
            }
        });
        return result;
    },
    deleteCollection:async(para)=>{
        let result = await db.Collection.destroy({
            where:{
                id:para
           }
        });
        return result;
    },
    getCollectionById:async(para)=>{
        let result = await db.Collection.findOne({
            where:{
                id:para
            },
        });
        return result;
    },
    getAllCollectionByBrandId:async(para)=>{
        let result = await db.Collection.findAll({
            where:{
                brandId:para
            }
        });
        return result;
    },
    getAllCollection:async()=>{
        let result = await db.Collection.findAll({
            include:[db.Brand]
        });
        return result;
    },
};