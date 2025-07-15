'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'shopId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Shops',
        key: 'id'
      },
      allowNull: true,
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'shopId');
  }
};
