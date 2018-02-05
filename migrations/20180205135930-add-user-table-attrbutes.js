module.exports = {
  up: (queryInterface, Sequelize) => {
    // Remove old attribute
    queryInterface.removeColumn('users', 'email');

    // Add new attribute
    queryInterface.addColumn('users', 'facebookId', Sequelize.STRING);
  },

  down: (queryInterface, Sequelize) => {
    // Remove new attribute
    queryInterface.removeColumn('users', 'facebookId');

    // Add old attribute
    queryInterface.addColumn('users', 'email', Sequelize.STRING);
  },
};
