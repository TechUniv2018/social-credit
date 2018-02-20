module.exports = (sequelize, DataTypes) => {
  const facebook = sequelize.define('facebook', {
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
  return facebook;
};
