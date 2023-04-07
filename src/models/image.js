'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Color, {
        through: { model: models.Variant, unique: false },
        foreignKey: {
          name: "imageId",
        },
      });
      this.belongsToMany(models.Product, {
        through: { model: models.Variant, unique: false },
        foreignKey: {
          name: "imageId",
        },
      });
    }
  }
  Image.init({
    alt: DataTypes.STRING,
    src: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Image',
  });
  return Image;
};