
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('loans', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    userId: {
      type: Sequelize.INTEGER,
    },
    loanId: {
      type: Sequelize.INTEGER,
    },
    outstandingAmount: {
      type: Sequelize.FLOAT,
    },
    totalAmount: {
      type: Sequelize.FLOAT,
    },
    installmentCount: {
      type: Sequelize.INTEGER,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: queryInterface => queryInterface.dropTable('loans'),
};
