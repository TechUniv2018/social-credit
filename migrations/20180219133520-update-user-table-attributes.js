

module.exports = {
  up: (queryInterface, Sequelize) => {
    // Remove attribute
    queryInterface.removeColumn('users', 'facebookId');

    // Add new attributes
    queryInterface.addColumn('users', 'socialScore', Sequelize.INTEGER);
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('users', 'socialScore');


    // Add old attribute
    queryInterface.addColumn('users', 'facebookId', Sequelize.STRING);
  },
};
