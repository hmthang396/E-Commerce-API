const db = require('../../models/index');

module.exports = {
    createOrder: async (params) => {
        let order = await db.Order.create(params);
        return order;
    },
    getOrderByCodeAndUserId: async (params) => {
        let result = await db.Order.findOne({
            where: {
                code: params.code,
                userId: params.userId
            },
            include: [{
                model: db.DetailOrder,
                include: [{
                    model: db.Product,
                }, {
                    model: db.Color,
                    include: [db.Image]
                }]
            }]
        });
        return result;
    },
    getOrderByCode: async (params) => {
        let result = await db.Order.findOne({
            where: {
                code: params
            },
            include: [{
                model: db.DetailOrder,
                include: db.Product
            }]
        })
        return result;
    },
    updateOrderByCode: async (params) => {
        let result = await db.Order.update(params, { where: { code: params.code } })
        return result;
    },

    getOrderByCodeAndEmail: async (params) => {
        let result = await db.Order.findOne({
            where: {
                code: params.code,
            },
            include: [{
                model: db.User,
                where: {
                    email: params.email,
                }
            }]
        })
        return result;
    },

    getAllOrderByEmail: async (params) => {
        let result = await db.Order.findAll({
            include: [{
                model: db.User,
                where: {
                    email: params.email
                }
            }, {
                model: db.Product,
                include: [db.Image]
            }]
        });
        return result;
    },
};