module.exports = (sequelize, DataTypes) => {
  const facebooks = sequelize.define('facebooks', {
    id: {
      type: DataTypes.STRING(20),
      primaryKey: true,
    },
    userId: DataTypes.INTEGER,
  }, {});

  facebooks.associate = (models) => {
    models.facebooks.belongsTo(models.users, { as: 'user' });
  };

  return facebooks;
};
