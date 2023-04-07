'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Brand extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Collection, {
        foreignKey: {
          name: "brandId",
        },
      });
      this.hasMany(models.Product, {
        foreignKey: {
            name: "brandId",
        },
    });
    }
  }
  Brand.init({
    title: DataTypes.STRING,
    icon: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Brand',
  });
  return Brand;
};