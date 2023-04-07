const db = require('../../models/index');
const fs = require("fs")
module.exports = {
    getAllImage: async () => {
        let images = await db.Image.findAll();
        return images;
    },
    getImageById: async (para) => {
        let image = await db.Image.findOne({
            where: {
                id: para
            }
        });
        return image;
    },
    createImage: async (para) => {
        let color_sync = db.Color.findOne({
            where: {
                id: para.colorId
            }
        });
        let product_sync = db.Product.findOne({
            where: {
                id: para.productId
            }
        });
        let color = await color_sync;
        let product = await product_sync;
        if (color && product) {
            let image = await db.Image.create({
                alt: color.color,
                src: para.image
            });
            db.Variant.create({
                productId: para.productId,
                colorId: para.colorId,
                imageId: image.id
            });
            return image;
        } else {
            return null;
        }
    },

    updateImage: async (para) => {
        let image = await db.Image.findOne({
            where: {
                id: para.imageId
            }
        });
        if (image) {
            fs.unlinkSync(`./src/public/Product/${image.src}`)
            let imageNew = await db.Image.update({
                src: para.image
            }, {
                where: {
                    id: image.id
                }
            });
            return imageNew;
        } else {
            return null;
        }

    },

    deleteImage: async (para) => {
        let image = await db.Image.findOne({
            where: {
                id: para
            }
        });
        if (image) {
            fs.unlinkSync(`./src/public/Product/${image.src}`)
            let variant = await db.Variant.destroy({
                where: {
                    imageId: image.id
                }
            });
            let imageDelete = await db.Image.destroy({
                where: {
                    id: image.id
                }
            });
            return imageDelete;
        } else {
            return 0;
        }
    }
}