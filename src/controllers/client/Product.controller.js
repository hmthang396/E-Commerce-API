const db = require('../../models/index');
const ENUM = require("../../config/Enum.model");
const { Op } = require("sequelize");
module.exports = {
    getProductById: async (para) => {
        let products = await db.Product.findAll({
            where: {
                id: para
            },
            include: [db.Image, db.Color, db.Brand, db.Category, db.Collection, db.Discount]
        });
        if (products) {
            let data = products.map(({ Images, ...product }) => {
                return {
                    ...product.dataValues,
                    Colors: product.dataValues.Colors.map(color => {
                        return {
                            ...color.dataValues,
                            Images: Images.filter(image => {
                                if (image?.Variant?.colorId === color.dataValues.id) {
                                    return {
                                        ...image.dataValues,
                                        Variant: {
                                            ...image.dataValues.Variant.dataValues
                                        }
                                    };
                                }
                            }),
                        };
                    }),
                    Brand: { ...product?.dataValues?.Brand?.dataValues },
                    Category: { ...product?.dataValues?.Category?.dataValues },
                    Collection: { ...product?.dataValues?.Collection?.dataValues },
                    Discount: { ...product?.dataValues?.Discount?.dataValues },
                };
            })
            data = data.map(({ Images, ...product }) => product);
            return data[0];
        } else {
            return null;
        }
    },
    getProductByTags: async (para) => {

        let products = await db.Product.findAll({
            include: [
                {
                    model: db.Image,
                },
                {
                    model: db.Color,
                },
                {
                    model: db.Brand,
                },
                {
                    model: db.Category,
                },
                {
                    model: db.Collection,
                },
                {
                    model: db.Discount,
                },
                {
                    model: db.Tag,
                    where: {
                        title: para
                    }
                },
            ]
        });
        if (products) {
            let data = products.map(({ Images, ...product }) => {
                return {
                    ...product.dataValues,
                    // Images: product.dataValues.Images.map(image=>{
                    //     return {
                    //         ...image.dataValues,
                    //         Variant : {
                    //             ...image.dataValues.Variant.dataValues
                    //         }
                    //     };
                    // }),
                    Colors: product.dataValues.Colors.map(color => {
                        return {
                            ...color.dataValues,
                            Images: Images.filter(image => {
                                if (image?.Variant?.colorId === color.dataValues.id) {
                                    return {
                                        ...image.dataValues,
                                        Variant: {
                                            ...image.dataValues.Variant.dataValues
                                        }
                                    };
                                }
                            }),
                        };
                    }),
                    Brand: { ...product?.dataValues?.Brand?.dataValues },
                    Category: { ...product?.dataValues?.Category?.dataValues },
                    Collection: { ...product?.dataValues?.Collection?.dataValues },
                    Discount: { ...product?.dataValues?.Discount?.dataValues },
                };
            })
            data = data.map(({ Images, ...product }) => product);
            return data;
        } else {
            return null;
        }
    },
    getProductByNew: async (para) => {
        para.page = (para.page <= 0) ? 1 : para.page;
        para.limit = (para.limit <= 0) ? 12 : para.limit;
        let offset = 0 + (para.page - 1) * para.limit;
        let product_process = db.Product.findAll({
            offset: parseInt(offset),
            limit: parseInt(para.limit),
            where: {
                isNew: true
            },
            include: [db.Brand, db.Category, db.Collection, db.Discount],
            order: [
                ['createdAt', 'DESC'],
            ],
        });
        let color_process = db.Color.findAll({
            include: [db.Image]
        })
        let products = await product_process;
        let colors = await color_process;
        if (products) {
            let data = products.map((product) => {
                return {
                    ...product.dataValues,
                    Brand: { ...product?.dataValues?.Brand?.dataValues },
                    Category: { ...product?.dataValues?.Category?.dataValues },
                    Collection: { ...product?.dataValues?.Collection?.dataValues },
                    Discount: { ...product?.dataValues?.Discount?.dataValues },
                    Colors: colors.filter(element => { return element.Images[0].Variant.productId === product.id; })
                }
            });
            return data;
        } else {
            return null;
        }
    },
    getAllProduct: async (para) => {
        para.page = (para.page <= 0) ? 1 : para.page;
        para.limit = (para.limit <= 0) ? 12 : para.limit;
        let offset = 0 + (para.page - 1) * para.limit;
        /*
        let products = await db.Product.findAll({
            offset: offset,
            limit: limit,
            include: [db.Image, db.Color, db.Brand, db.Category, db.Collection, db.Discount]
        });
        
        if (products) {
            let data = products.map(({ Images, ...product }) => {
                return {
                    ...product.dataValues,
                    Colors: product.dataValues.Colors.map(color => {
                        return {
                            ...color.dataValues,
                            Images: Images.filter(image => {
                                if (image?.Variant?.colorId === color.dataValues.id) {
                                    return {
                                        ...image.dataValues,
                                        Variant: {
                                            ...image.dataValues.Variant.dataValues
                                        }
                                    };
                                }
                            }),
                        };
                    }),
                    Brand: { ...product?.dataValues?.Brand?.dataValues },
                    Category: { ...product?.dataValues?.Category?.dataValues },
                    Collection: { ...product?.dataValues?.Collection?.dataValues },
                    Discount: { ...product?.dataValues?.Discount?.dataValues },
                    // Variants: product?.dataValues?.Variants.map(variant=>{
                    //     return {
                    //         ...variant?.dataValues,
                    //     };
                    // }),
                };
            })
            data = data.map(({ Images, ...product }) => product);
            return data;
        } else {
            return null;
        }
        */
        // Performance Optimization v1
        let product_process = db.Product.findAll({
            offset: parseInt(offset),
            limit: parseInt(para.limit),
            include: [db.Brand, db.Category, db.Collection, db.Discount]
        });
        let color_process = db.Color.findAll({
            include: [db.Image]
        })
        let products = await product_process;
        let colors = await color_process;
        if (products) {
            let data = products.map((product) => {
                return {
                    ...product.dataValues,
                    Brand: { ...product?.dataValues?.Brand?.dataValues },
                    Category: { ...product?.dataValues?.Category?.dataValues },
                    Collection: { ...product?.dataValues?.Collection?.dataValues },
                    Discount: { ...product?.dataValues?.Discount?.dataValues },
                    Colors: colors.filter(element => { return element.Images[0].Variant.productId === product.id; })
                }
            });
            return data;
        } else {
            return null;
        }
    },
    getandUpdateProductById: async (id, quanlity) => {
        let product = await db.Product.findOne({
            where: {
                id: id
            },
            attributes: ["stock"],
        });
        db.Product.update({
            stock: (parseInt(product.stock) - quanlity > 0) ? (parseInt(product.stock) - quanlity) : 0
        }, {
            where: {
                id: id
            },
        })
        return {
            stock: parseInt(product.stock) - quanlity
        };
    },
    getProduct: async (para) => {
        para.page = (para.page <= 0) ? 1 : para.page;
        para.limit = (para.limit <= 0) ? 12 : para.limit;
        let offset = 0 + (para.page - 1) * para.limit;
        //
        let config = {
            offset: parseInt(offset),
            limit: parseInt(para.limit),
            include: [{
                model: db.Category,
            }, {
                model: db.SubCategory,
            }, {
                model: db.Collection,
            }, {
                model: db.Discount,
            }]
        };
        if (para.category && !(para.category == 'null') && !(para.category == 'undifined')) {
            config.include[0].where = {
                title: para.category
            }
        }
        if (para.subCategory && !(para.subCategory == 'null') && !(para.subCategory == 'undifined')) {
            config.include[1].where = {
                title: para.subCategory
            }
        }
        if (para.collection && !(para.collection == 'null') && !(para.collection == 'undifined')) {
            config.include[2].where = {
                title: para.collection
            }
        }
        if (para.type && !(para.type == 'null') && !(para.type == 'undefined')) {
            config["where"] = {
                ...config["where"],
                type: para.type
            }
        }
        //
        let totalProduct_process = db.Product.count(config);
        let product_process = db.Product.findAll(config);
        let color_process = db.Color.findAll({
            include: [db.Image]
        })
        let products = await product_process;
        let colors = await color_process;
        let totalProduct = await totalProduct_process;
        if (products) {
            let data = products.map((product) => {
                return {
                    ...product.dataValues,
                    Brand: { ...product?.dataValues?.Brand?.dataValues },
                    Category: { ...product?.dataValues?.Category?.dataValues },
                    Collection: { ...product?.dataValues?.Collection?.dataValues },
                    Discount: { ...product?.dataValues?.Discount?.dataValues },
                    Colors: colors.filter(element => { return element.Images[0].Variant.productId === product.id; }),
                    total: totalProduct
                }
            });
            return data;
        } else {
            return null;
        }
    },
    getPriceOfProductByColorIDAndProductId: async (para) => {
        let product = await db.Product.findOne({
            where: {
                id: para.productId
            },
            include: [{
                model: db.Color,
                where: {
                    id: para.colorId
                }
            }, {
                model: db.Discount,
            }]
        });
        return {
            ...product?.dataValues,
            Discount: { ...product?.dataValues?.Discount?.dataValues },
        };
    },
    getProductSortByOrder: async (para) => {
        para.page = (para.page <= 0) ? 1 : para.page;
        para.limit = (para.limit <= 0) ? 12 : para.limit;
        let offset = 0 + (para.page - 1) * para.limit;

        let topOrder = await db.DetailOrder.findAll({
            offset: parseInt(offset),
            limit: parseInt(para.limit),
            attributes: [
                'productId',
                [db.sequelize.fn('sum', db.sequelize.col('quanlity')), 'sum'],
            ],
            group: ['productId'],
            order: [
                ['sum', 'DESC'],
            ],
        });

        let listProductId = topOrder.map((e) => { return { id: e.productId } });
        let product_process = db.Product.findAll({
            where: {
                [Op.or]: listProductId
            },
            include: [db.Brand, db.Category, db.Collection, db.Discount]
        });
        let color_process = db.Color.findAll({
            include: [db.Image]
        })
        let products = await product_process;
        let colors = await color_process;
        if (products) {
            let data = products.map((product) => {
                return {
                    ...product.dataValues,
                    Brand: { ...product?.dataValues?.Brand?.dataValues },
                    Category: { ...product?.dataValues?.Category?.dataValues },
                    Collection: { ...product?.dataValues?.Collection?.dataValues },
                    Discount: { ...product?.dataValues?.Discount?.dataValues },
                    Colors: colors.filter(element => { return element.Images[0].Variant.productId === product.id; })
                }
            });
            return data;
        } else {
            return null;
        }
    },
    getProductSortByPrice: async (para) => {
        let topPrice = await db.Color.findAll({
            attributes: ['price'],
            include: [{
                attributes: ['id'],
                model: db.Product,
            }],
            order: [
                [db.sequelize.literal('CAST("price" as INTEGER)'), 'ASC'],
            ],
        });
        let listProductId = topPrice.map((e) => { return e.Products[0].id; });
        listProductId = Array.from(new Set(listProductId)).slice(0, 12);
        let product_process = db.Product.findAll({
            where: {
                id: {
                    [Op.or]: listProductId
                }
            },
            include: [db.Brand, db.Category, db.Collection, db.Discount]
        });
        let color_process = db.Color.findAll({
            include: [db.Image]
        })
        let products = await product_process;
        let colors = await color_process;
        if (products) {
            let data = products.map((product) => {
                return {
                    ...product.dataValues,
                    Brand: { ...product?.dataValues?.Brand?.dataValues },
                    Category: { ...product?.dataValues?.Category?.dataValues },
                    Collection: { ...product?.dataValues?.Collection?.dataValues },
                    Discount: { ...product?.dataValues?.Discount?.dataValues },
                    Colors: colors.filter(element => { return element.Images[0].Variant.productId === product.id; })
                }
            });
            return data;
        } else {
            return null;
        }
    },
    getProductByCollection: async (para) => {
        para.page = (para.page <= 0) ? 1 : para.page;
        para.limit = (para.limit <= 0) ? 12 : para.limit;
        let offset = 0 + (para.page - 1) * para.limit;
        let productRef = await db.Product.findOne({
            attributes: ['collectionId'],
            where: {
                id: para.productId
            }
        })
        let product_process = db.Product.findAll({
            offset: parseInt(offset),
            limit: parseInt(para.limit),
            where: {
                id: {
                    [Op.ne]: para.productId
                }
            },
            include: [{
                model: db.Collection,
                where: {
                    id: productRef.collectionId
                }
            }, db.Category, db.Brand, db.Discount]
        });
        let color_process = db.Color.findAll({
            include: [db.Image]
        })
        let products = await product_process;
        let colors = await color_process;
        if (products) {
            let data = products.map((product) => {
                return {
                    ...product.dataValues,
                    Brand: { ...product?.dataValues?.Brand?.dataValues },
                    Category: { ...product?.dataValues?.Category?.dataValues },
                    Collection: { ...product?.dataValues?.Collection?.dataValues },
                    Discount: { ...product?.dataValues?.Discount?.dataValues },
                    Colors: colors.filter(element => { return element.Images[0].Variant.productId === product.id; }),
                }
            });
            return data;
        } else {
            return null;
        }
    },
    optim: async () => {
        let product_process = db.Product.findAll({
            offset: 1,
            limit: 12,
            include: [db.Brand, db.Category, db.Collection, db.Discount]
        });
        let color_process = db.Color.findAll({
            include: [db.Image]
        })
        let products = await product_process;
        let colors = await color_process;
        let data = products.map((product) => {
            return {
                ...product.dataValues,
                Brand: { ...product?.dataValues?.Brand?.dataValues },
                Category: { ...product?.dataValues?.Category?.dataValues },
                Collection: { ...product?.dataValues?.Collection?.dataValues },
                Discount: { ...product?.dataValues?.Discount?.dataValues },
                Colors: colors.filter(element => { return element.Images[0].Variant.productId === product.id; })
            }
        });
        return data
    },
    getProductByKey: async (para) => {
        let config = {
            include: [{
                model: db.Category,
            }, {
                model: db.SubCategory,
            }, {
                model: db.Collection,
            }, {
                model: db.Discount,
            }]
        };
        let arrayKey = para.toString().split(' ').map((key) => {
            return {
                title: {
                    [Op.substring]: key
                }
            }
        });
        let product_process1 = db.Product.findAll({
            attributes: ["id"],
            where: {
                [Op.or]: arrayKey
            },
        });
        let product_process2 = db.Product.findAll({
            attributes: ["id"],
            include: [
                {
                    model: db.SubCategory,
                    attributes: [],
                    where: {
                        [Op.or]: arrayKey
                    },
                }
            ]
        });
        let product_process3 = db.Product.findAll({
            attributes: ["id"],
            include: [
                {
                    model: db.Collection,
                    attributes: [],
                    where: {
                        [Op.or]: arrayKey
                    },
                }
            ]
        });
        let product_process4 = db.Product.findAll({
            attributes: ["id"],
            include: [
                {
                    model: db.Tag,
                    attributes: [],
                    where: {
                        [Op.or]: arrayKey
                    },
                }
            ]
        });
        let arrayId = [
            ...await product_process1,
            ...await product_process2,
            ...await product_process3,
            ...await product_process4
        ];
        let product = await db.Product.findAll({
            attributes: ["id", "title"],
            where: {
                [Op.or]: {
                    id: [...new Set(arrayId.map((product) => { return product.id; }))]
                }
            },
        });

        return product;
    },
};