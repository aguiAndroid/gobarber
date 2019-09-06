'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('cities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      state_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      state_initials: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      country_name: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Brasil',
      },
      country_initials: {
        type: Sequelize.STRING,
        defaultValue: 'BR',
      },
      visibility: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: queryInterface => {
    return queryInterface.dropTable('cities');
  },
};
