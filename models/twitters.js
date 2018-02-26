module.exports = (sequelize, DataTypes) => {
  const twitters = sequelize.define('twitters', {
    id: {
      type: DataTypes.STRING(20),
      primaryKey: true,
    },
    userId: DataTypes.INTEGER,
  }, {
    classMethods: {
      associate() {
        // associations can be defined here
      },
    },
  });
  return twitters;
};
