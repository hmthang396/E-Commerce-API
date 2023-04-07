const db = require('../../models/index');
const ENUM = require("../../config/Enum.model");
module.exports = {
    getColorById:async(para)=>{
        let colors = await db.Color.findOne({
            where:{
                id:para
            },
            include:[db.Image]
        });
        return colors;
    },
    getAllColor:async()=>{
        let colors = await db.Color.findAll({
            include:[db.Image]
        });
        return colors;
    },
    addColorForProduct:async(para)=>{
        let color_sync = db.Color.create(para.color);
        let image_sync = db.Image.bulkCreate(para.image);
        let color= await color_sync;
        let image= await image_sync;
        let data = image.map(img=>{
            return {
            productId: para.product.id,
            colorId: color.id,
            imageId: img.id
            }
        });
        let result = await db.Variant.bulkCreate(data);
        return result;
    },
    updateColor:async(para)=>{
        const result = await db.Color.update(para,{
            where:{
                id: para.id
            }
        });
        return result;
    },
    deleteColorFromProduct : async(para)=>{
        let variant = await db.Variant.findAll({
            where:{
                colorId : para
            }
        });
        variant.map(element=>{
            db.Image.destroy({
                where:{
                    id : element.imageId
                }
            });
        })
        let result = await db.Color.destroy({
           where:{
                id:para
           }
        });
        console.log(result);
        return result;
    }
};