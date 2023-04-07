const db = require('../../models/index');
const fs = require("fs")
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
    createProduct: async (para) => {
        let color_sync = db.Color.create(para.color);
        let image_sync = db.Image.bulkCreate(para.image);
        let product_sync = await db.Product.create(
            {
                ...para.product,
                Tags: para.tag
            },
            {
                include: db.Tag
            }
        );
        let color = await color_sync;
        let image = await image_sync;
        let product = await product_sync;
        //let product= await product_sync;

        let data = image.map(img => {
            return {
                productId: product.id,
                colorId: color.id,
                imageId: img.id
            }
        });
        db.Variant.bulkCreate(data);
        return product;
    },
    getProductById: async (para) => {
        let product = await db.Product.findOne({
            where: {
                id: para
            },
            include: [db.Image, db.Color, db.Variant, db.Brand, db.Category, db.Collection, db.Discount]
        });
        if (product) {
            let { Images, ...data } = product;
            data = {
                ...data.dataValues,
                Colors: data.dataValues.Colors.map(color => {
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
                Brand: { ...data?.dataValues?.Brand?.dataValues },
                Category: { ...data?.dataValues?.Category?.dataValues },
                Collection: { ...data?.dataValues?.Collection?.dataValues },
                Discount: { ...data?.dataValues?.Discount?.dataValues },
            };
            return data;
        } else {
            return null;
        }
    },
    getAllProduct: async () => {
        let product_process = db.Product.findAll({
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
    updateProduct: async (para) => {
        let product_sync = db.Product.update(para.product, {
            where: {
                id: para.product.id
            }
        });
        let color_sync = db.Color.update(para.color, {
            where: {
                id: para.color.id
            }
        })
        let product = await product_sync;
        return product;
    },
    deleteProductById: async (para) => {
        let variant_process = db.Variant.findAll({
            include: {
                model: db.Product,
                where: {
                    id: para
                }
            }
        });
        let listImages_process = db.Image.findAll({
            include: {
                model: db.Product,
                where: {
                    id: para
                }
            }
        });
        let variant = await variant_process;
        let listImages = await listImages_process;
        for (let i = 0; i < listImages.length; i++) {
            fs.unlinkSync(`./src/public/Product/${listImages[i].src}`)
        }
        if (variant) {
            variant.map(element => {
                db.Color.destroy({
                    where: {
                        id: element.dataValues.colorId,
                    }
                });
                db.Image.destroy({
                    where: {
                        id: element.dataValues.imageId,
                    }
                });
                return;
            });
            let result = await db.Product.destroy({
                where: {
                    id: para
                }
            });
            return result;
        } else {
            return null;
        }
    },
    updateDiscountForProduct: async (para) => {
        let discount = await db.Discount.findOne({
            where: {
                id: para.discountId
            }
        });
        let discountUpdateRaw = db.Discount.update({
            status: checkStatus(null, discount.beginAt, discount.endAt)
        }, {
            where: {
                id: para.discountId
            }
        });
        let productUpdateRaw = db.Product.update({
            discountId: para.discountId
        }, {
            where: {
                id: para.productId
            }
        });
        let discountUpdate = await discountUpdateRaw;
        let productUpdate = await productUpdateRaw;
        if (productUpdate[0] > 0) {
            return true;
        }
        return false;
    },
    getProductByIdAndColor: async (para) => {
        let product = await db.Product.findOne({
            where: {
                id: para.productId
            },
            include: [db.Image, {
                model: db.Color,
                where: {
                    id: para.colorId
                }
            }, db.Variant, db.Brand, db.Category, db.Collection, db.Discount]
        });
        if (product) {
            let { Images, ...data } = product;
            data = {
                ...data.dataValues,
                Colors: data.dataValues.Colors.map(color => {
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
                Brand: { ...data?.dataValues?.Brand?.dataValues },
                Category: { ...data?.dataValues?.Category?.dataValues },
                Collection: { ...data?.dataValues?.Collection?.dataValues },
                Discount: { ...data?.dataValues?.Discount?.dataValues },
            };
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
};