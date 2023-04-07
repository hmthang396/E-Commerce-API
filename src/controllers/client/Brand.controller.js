const db = require('../../models/index');
module.exports = {
    getAllBrand: async () => {
        let result = await db.Brand.findAll()
        return result;
    },
};