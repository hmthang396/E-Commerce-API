const db = require('../../models/index');
module.exports = {
    createUser: async (params) => {
        let result = await db.User.create(params);
        return result;
    },
    getUserById: async (params) => {
        let result = await db.User.findOne({
            where: {
                id: params
            }
        });
        return result;
    },
    getUserByEmail: async (params) => {
        let result = await db.User.findOne({
            where: {
                email: params
            },
            raw:true
        });
        return result;
    },
};