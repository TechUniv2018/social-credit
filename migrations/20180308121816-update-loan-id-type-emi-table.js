module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.removeColumn('emis', 'loanId')
      .then(() => queryInterface.addColumn('emis', 'loanId', {
        type: Sequelize.INTEGER,
      })),

  down: (queryInterface, Sequelize) =>
    queryInterface.removeColumn('emis', 'loanId')
      .then(() => queryInterface.addColumn('emis', 'loanId', {
        type: Sequelize.STRING,
      })),
};
