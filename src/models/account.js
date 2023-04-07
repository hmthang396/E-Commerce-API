'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Role, {
        foreignKey: {
          name: "roleId",
        },
      });
    }
  }
  Account.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    fullname: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    position: {
      type: DataTypes.ENUM,
      values:['Administrator', 'Customer', 'Manager']
    },
    pic: {
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'Account',
  });
  return Account;
};