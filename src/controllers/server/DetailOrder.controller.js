const db = require('../../models/index');

module.exports = {
    getAllDetailOrder: async () => {
        let result = await db.DetailOrder.findAll({
            include: [{
                model: db.Order,
            }, {
                model: db.Product,
                include : [db.Image]
            }]
        }); 
        return result;
    }
};