module.exports = {
  up: (queryInterface) => {
    // Remove old attribute
    queryInterface.removeColumn('loans', 'loanID');
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.addColumn('loans', 'loanID', Sequelize.INTEGER);
  },
};
