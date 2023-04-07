'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        trim: true,
      },
      description: {
        type: Sequelize.TEXT,
        trim: true,
      },
      type: {
        type: Sequelize.STRING,
        trim: true,
      },
      status: {
        type: Sequelize.BOOLEAN,
        default : true
      },
      isNew: {
        type: Sequelize.BOOLEAN,
        default : false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
  }
};