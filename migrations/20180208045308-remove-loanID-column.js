module.exports = {
  up: (queryInterface, Sequelize) => {
    // Remove old attribute
    queryInterface.removeColumn('loans', 'loanID');
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.addColumn('loans', 'loanID', Sequelize.INTEGER);
  },
};
