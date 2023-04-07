'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      code: {
        type: Sequelize.STRING,
        unique: true,
        trim: true,
      },
      total: {
        type: Sequelize.DECIMAL,
        trim: true,
      },
      status: {
        type: Sequelize.STRING,
        trim: true,
      },
      fullname: {
        type: Sequelize.STRING,
        trim: true
      },
      address: {
        type: Sequelize.STRING,
        trim: true
      },
      method: {
        type: Sequelize.STRING,
        trim: true
      },
      phoneNumber: {
        type: Sequelize.STRING,
        trim: true
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
    await queryInterface.dropTable('Orders');
  }
};