'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Order, {
        foreignKey: {
          name: "userId",
        },
      });
      this.hasMany(models.Comment, {
        foreignKey: {
          name: "userId",
        },
      });
      this.belongsToMany(models.Comment, {
        through: { model: models.Like, unique: false },
        foreignKey: {
          name: "userId",
        },
      });
    }
  }
  User.init({
    fullname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    pic: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};