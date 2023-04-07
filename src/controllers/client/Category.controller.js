const db = require('../../models/index');
module.exports = {
    getAllCategory: async () => {
        let result = await db.Category.findAll({
            include:[db.SubCategory]
        });
        return result;
    },
};