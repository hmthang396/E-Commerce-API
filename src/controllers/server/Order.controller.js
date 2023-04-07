const db = require('../../models/index');

module.exports = {
    getAllOrder: async () => {
        let result = await db.Order.findAll({
            include: [{
                model: db.User,
            }, {
                model: db.Product,
                include: [db.Image]
            }]
        });
        return result;
    },
    updateStatus: async (param) => {
        let result = await db.Order.update({
            status: param.status
        }, {
            where: {
                code: param.code
            }
        });
        return result;
    }
};