

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('loans', 'installmentCount');

    // Add new attributes
    queryInterface.addColumn('loans', 'outstandingInstallments', Sequelize.INTEGER);
    queryInterface.addColumn('loans', 'totalInstallments', Sequelize.INTEGER);
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.addColumn('loans', 'installmentCount', Sequelize.INTEGER);

    // Add new attributes
    queryInterface.removeColumn('loans', 'outstandingInstallments');
    queryInterface.removeColumn('loans', 'totalInstallments');
  },
};
