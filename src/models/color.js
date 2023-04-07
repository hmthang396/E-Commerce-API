'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Color extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Product, {
        through: { model: models.Variant, unique: false },
        foreignKey: {
          name: "colorId",
        },
      });
      this.belongsToMany(models.Image, {
        through: { model: models.Variant, unique: false },
        foreignKey: {
          name: "colorId",
        },
      });
      this.hasMany(models.DetailOrder, {
        foreignKey: {
          name: "colorId",
        },
      });
    }
  }
  Color.init({
    color: DataTypes.STRING,
    stock: DataTypes.INTEGER,
    price: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Color',
  });
  return Color;
};