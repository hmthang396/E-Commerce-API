'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: {
          name: "userId",
        },
      });
      this.hasMany(models.DetailOrder, {
        foreignKey: {
          name: "orderId",
        },
      });
      this.belongsToMany(models.Product, {
        through: { model: models.DetailOrder, unique: false },
        foreignKey: {
          name: "orderId",
        },
      });
      
    }
  }
  Order.init({
    code: DataTypes.STRING,
    total: DataTypes.DECIMAL,
    status: DataTypes.STRING,
    fullname: DataTypes.STRING,
    address: DataTypes.STRING,
    method: DataTypes.STRING,
    isCheckout: DataTypes.BOOLEAN,
    phoneNumber: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};