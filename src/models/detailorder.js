'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DetailOrder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      this.belongsTo(models.Color, {
        foreignKey: {
          name: "colorId",
        },
      });
      this.belongsTo(models.Order, {
        foreignKey: {
          name: "orderId",
        },
      });
      this.belongsTo(models.Product, {
        foreignKey: {
          name: "productId",
        },
      });
    }
  }
  DetailOrder.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    code: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    quanlity: DataTypes.INTEGER,
    status: DataTypes.STRING,
    size: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'DetailOrder',
  });
  return DetailOrder;
};