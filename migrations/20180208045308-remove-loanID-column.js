module.exports = {
  up: (queryInterface) => {
    // Remove old attribute
    queryInterface.removeColumn('loans', 'loanId');
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.addColumn('loans', 'loanId', Sequelize.INTEGER);
  },
};
