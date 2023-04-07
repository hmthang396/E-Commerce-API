const db = require('../../models/index');
const ENUM = require("../../config/Enum.model");
const checkStatus = (parameter, start, end) => {
    let timeNow, timeStart, timeEnd;
    timeStart = new Date(start).getTime();
    timeEnd = new Date(end).getTime();
    if (!parameter) {
        timeNow = new Date().getTime();
    } else {
        timeNow = new Date(parameter).getTime();
    }
    if (timeNow < timeEnd && timeNow > timeStart) return true;
    return false;
}
module.exports = {
    createDiscount: async (para) => {
        let result = await db.Discount.create({ ...para, status: checkStatus(null, para.beginAt, para.endAt) });
        return result;
    },
    updateDiscount: async (para) => {
        let result = await db.Discount.update(para, {
            where: {
                id: para.id
            }
        });
        return result;
    },
    deleteDiscount: async (para) => {
        let result = await db.Discount.destroy({
            where: {
                id: parseInt(para)
            }
        });
        return result;
    },
    getDiscountById: async (para) => {
        let result = await db.Discount.findOne({
            where: {
                id: para
            }
        });
        return result;
    },
    getAllDiscount: async (option) => {
        let result = await db.Discount.findAll({
            where: option
        });
        return result;
    },
};