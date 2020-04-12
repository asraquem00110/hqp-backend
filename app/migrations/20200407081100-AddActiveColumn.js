'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
          queryInterface.addColumn('Addresses', 'archive', {
              type: Sequelize.INTEGER,
              defaultValue: 0,
        }, { transaction: t }),
          queryInterface.addColumn('Barangays', 'archive', {
            type: Sequelize.INTEGER,
            defaultValue: 0,
        }, { transaction: t }),
        queryInterface.addColumn('Families', 'archive', {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        }, { transaction: t }),
        queryInterface.addColumn('Members', 'archive', {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        }, { transaction: t }),
        queryInterface.addColumn('Streets', 'archive', {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        }, { transaction: t }),
        queryInterface.addColumn('Users', 'archive', {
          type: Sequelize.INTEGER,
          defaultValue: 0,
       }, { transaction: t }),
          
      ])
  })
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
