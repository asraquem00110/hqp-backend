'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
        return Promise.all([
            queryInterface.addColumn('Addresses', 'barangayId', {
                type: Sequelize.INTEGER,
                allowNull: false,
            }, { transaction: t }),
        ])
    })
  },

  down: (queryInterface, Sequelize) => {
    
  }
};
