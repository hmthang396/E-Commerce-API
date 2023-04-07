'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Product, {
        foreignKey: {
          name: "productId",
        },
      });
      this.belongsTo(models.User, {
        foreignKey: {
          name: "userId",
        },
      });
      this.belongsToMany(models.User, {
        through: { model: models.Like, unique: false },
        foreignKey: {
          name: "commentId",
        },
      });
      this.hasMany(models.Like, {
        foreignKey: {
          name: "commentId",
        },
      });
    }
  }
  Comment.init({
    content: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};