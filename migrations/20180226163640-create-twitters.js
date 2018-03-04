module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('twitters', {
    id: {
      allowNull: false,
      type: Sequelize.STRING(20),
      primaryKey: true,
    },
    userId: {
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
  down: queryInterface => queryInterface.dropTable('twitters'),
};
