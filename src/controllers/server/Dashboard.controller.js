const { Op } = require('sequelize');
const db = require('../../models/index');

const getSumQuanlityOfDetailOrderByCategoryAndMonths = async (category, months) => {
    const year = new Date().getFullYear();
    const monthRanges = months.map(month => ({
        firstDayOfMonth: new Date(year, month, 1),
        lastDayOfMonth: new Date(year, month + 1, 0)
    }));
    const result = await Promise.allSettled(
        monthRanges.map(async ({ firstDayOfMonth, lastDayOfMonth }) => {
            let data = await db.DetailOrder.findOne({
                attributes: [
                    [db.sequelize.fn('sum', db.sequelize.col('quanlity')), 'value'],
                ],
                required: true,
                where: {
                    createdAt: {
                        [Op.gte]: firstDayOfMonth,
                        [Op.lte]: lastDayOfMonth
                    }
                },
                include: [
                    {
                        attributes: [],
                        model: db.Product,
                        required: true,
                        include: [{
                            attributes: [],
                            model: db.Category,
                            required: true,
                            where: {
                                id: category.id
                            }
                        }]
                    }
                ],
                raw: true
            });
            return (data.value) ? parseInt(data?.value) : 0;
        })
    );
    return result;
}
const getTotalNumberProductsByCategory = async (categories) => {
    const valuesToSum = Array.from({ length: 12 }, (_, i) => i);
    const result = await Promise.allSettled(
        categories.map(async (category) => {
            const values = await getSumQuanlityOfDetailOrderByCategoryAndMonths(category, valuesToSum);
            return {
                title: category.title,
                value: values.map((e) => { return e?.value || 0 })
                //...values.reduce((acc, value, idx) => ([...acc, value.value ]), []) // convert the array of values into an object with keys value1 to value12
            }
        })
    );
    return result.filter(({ status }) => status === 'fulfilled').map(({ value }) => value);
}

const getSumQuantityOfDetailOrderBySubCategoryAndMonths = async (subCategory, months) => {
    const year = new Date().getFullYear();
    const monthRanges = months.map(month => ({
        firstDayOfMonth: new Date(year, month, 1),
        lastDayOfMonth: new Date(year, month + 1, 0)
    }));
    const result = await Promise.allSettled(
        monthRanges.map(async ({ firstDayOfMonth, lastDayOfMonth }) => {
            let data = await db.DetailOrder.findOne({
                attributes: [
                    [db.sequelize.fn('sum', db.sequelize.col('quanlity')), 'value'],
                ],
                where: {
                    createdAt: {
                        [Op.gte]: firstDayOfMonth,
                        [Op.lte]: lastDayOfMonth
                    }
                },
                required: true,
                include:
                {
                    model: db.Product,
                    required: true,
                    attributes: [
                    ],
                    include: {
                        attributes: [

                        ],
                        model: db.SubCategory,
                        required: true,
                        where: {
                            id: subCategory.id
                        }
                    }
                },
                raw: true
            });
            return data.value ? parseInt(data.value) : 0;
        })
    );
    return result;
}

const getTotalNumberOfProductsBySubCategory = async (subCategories) => {
    const valuesToSum = Array.from({ length: 12 }, (_, i) => i);
    const result = await Promise.allSettled(
        subCategories.map(async (subCatetory) => {
            const values = await getSumQuantityOfDetailOrderBySubCategoryAndMonths(subCatetory, valuesToSum);
            return {
                title: subCatetory.title,
                value: values.map((e) => { return e?.value || 0 })
                //...values.reduce((acc, value, idx) => ({ ...acc, [`value${idx + 1}`]: value.value }), {}) // convert the array of values into an object with keys value1 to value12
            }
        })
    );
    return result.filter(({ status }) => status === 'fulfilled').map(({ value }) => value);
}


module.exports = {
    getNumberOfOrder: async () => {
        //let curentMonth = (parseInt(new Date().getMonth()) + 1) > 10 ? parseInt(new Date().getMonth()) + 1 : `0${parseInt(new Date().getMonth()) + 1}`;
        let result1_process = db.Order.count({
            where: {
                status: "Xác nhận",
                createdAt: {
                    [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                }
            }
        });
        let result2_process = db.Order.count({
            where: {
                status: "Đang chờ gửi",
                createdAt: {
                    [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                }
            }
        });
        let result3_process = db.Order.count({
            where: {
                status: "Đang gửi",
                createdAt: {
                    [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                }
            }
        });
        let result4_process = db.Order.count({
            where: {
                status: "Hoàn thành",
                createdAt: {
                    [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                }
            }
        });
        let result1 = await result1_process;
        let result2 = await result2_process;
        let result3 = await result3_process;
        let result4 = await result4_process;
        return [
            { status: "Xác nhận", value: result1 },
            { status: "Đang chờ gửi", value: result2 },
            { status: "Đang gửi", value: result3 },
            { status: "Hoàn thành", value: result4 },
        ];
    },
    getTotalNumberProduct: async (categoryId) => {
        let categories = await db.Category.findAll({
            where: {
                id: categoryId
            },
            require: true,
            include: [db.SubCategory],
        });
        const result = await Promise.allSettled(
            categories.map(async (category) => {
                return {
                    Category: await getTotalNumberProductsByCategory([category]),
                    SubCategory: await getTotalNumberOfProductsBySubCategory(category.SubCategories)
                }
            })
        );
        return result.filter(({ status }) => status === 'fulfilled').map(({ value }) => value);
    },
    getTotalNumberProductByCategory: async () => {
        let categories = await db.Category.findAll();
        let result = getTotalNumberProductsByCategory(categories);
        return result;
    },
    getTotalNumberProductBySubCatrgory: async () => {
        let subCategories = await db.SubCategory.findAll();
        let result = await getTotalNumberOfProductsBySubCategory(subCategories);
        return result;
    },
}