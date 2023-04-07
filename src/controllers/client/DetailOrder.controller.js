const db = require('../../models/index');
module.exports = {
    createDetailOrder: async (params) => {
        let detailOrder = await db.DetailOrder.create(params);
        return detailOrder;
    },
    getDetailOrderByCode: async (params) => {
        let result = await db.DetailOrder.findOne({
            where: {
                code: params
            },
            attributes: ["code"],
        })
        return result;
    },
    upadteStatusDetailOrder:async (params) =>{
        let result = await db.DetailOrder.update(params,{
            where: {
                code: params.code
            },
        })
        return result;
    }
};