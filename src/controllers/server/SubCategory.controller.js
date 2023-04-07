const db = require('../../models/index');
const fs = require("fs")
module.exports = {
    createSubCategory: async (para) => {
        let result = await db.SubCategory.create(para);
        return result;
    },
    updateSubCategory: async (para) => {
        let subCategory_sync = db.SubCategory.findOne({
            where: {
                id: para.id
            },
        })
        let result_sync = db.SubCategory.update(para, {
            where: {
                id: para.id
            }
        });
        let subCategory = await subCategory_sync;
        let result = await result_sync;

        if (para.icon) {
            fs.unlinkSync(`./src/public/SubCategory/${subCategory.icon}`)
        }
        return result;
    },
    deleteSubCategory: async (para) => {
        let subCategory_sync = db.SubCategory.findOne({
            where: {
                id: para
            },
        })
        let subCategory = await subCategory_sync;
        fs.unlinkSync(`./src/public/SubCategory/${subCategory.icon}`)
        let result = await db.SubCategory.destroy({
            where: {
                id: para
            }
        });
        return result;
    },
    getSubCategoryById: async (para) => {
        let result = await db.SubCategory.findOne({
            where: {
                id: para
            },
            include: [db.Category]
        })
        return result;
    },
    getAllSubCategory: async (para) => {
        let result = await db.SubCategory.findAll({
            where: {
                categoryId: parseInt(para)
            },
            include: [db.Category]
        });
        return result;
    }
};