
module.exports = (sequelize, DataTypes) => {
  const bank = sequelize.define('banks', {
    amount: DataTypes.FLOAT,
    currency: DataTypes.STRING,
  }, {
    classMethods: {
      associate(models) {
        // associations can be defined here
      },
    },
  });
  return bank;
};
