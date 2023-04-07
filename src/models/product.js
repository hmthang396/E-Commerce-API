'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.SubCategory, {
        foreignKey: {
          name: "subCategoryId",
        },
      });
      this.belongsTo(models.Brand, {
        foreignKey: {
          name: "brandId",
        },
      });
      this.belongsTo(models.Category, {
        foreignKey: {
          name: "categoryId",
        },
      });
      this.belongsTo(models.Collection, {
        foreignKey: {
          name: "collectionId",
        },
      });
      this.belongsTo(models.Discount, {
        foreignKey: {
          name: "discountId",
        },
      });
      this.hasMany(models.Tag, {
        foreignKey: {
          name: "productId",
        },
      });
      this.belongsToMany(models.Color, {
        through: { model: models.Variant, unique: false },
        foreignKey: {
          name: "productId",
        },
      });
      this.belongsToMany(models.Image, {
        through: { model: models.Variant, unique: false },
        foreignKey: {
          name: "productId",
        },
      });
      this.hasMany(models.Variant, {
        foreignKey: {
          name: "productId",
        },
      });
      this.belongsToMany(models.Order, {
        through: { model: models.DetailOrder, unique: false },
        foreignKey: {
          name: "productId",
        },
      });
      this.hasMany(models.DetailOrder, {
        foreignKey: {
          name: "productId",
        },
      });
      this.hasMany(models.Comment, {
        foreignKey: {
          name: "productId",
        },
      });
    }
  }
  Product.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    type: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    isNew: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};