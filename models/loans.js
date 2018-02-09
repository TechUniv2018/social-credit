
module.exports = (sequelize, DataTypes) => {
  const loans = sequelize.define('loans', {
    userId: DataTypes.INTEGER,
    outstandingAmount: DataTypes.FLOAT,
    totalAmount: DataTypes.FLOAT,
    installmentCount: DataTypes.INTEGER,
  }, {
    classMethods: {
      associate() {
        // associations can be defined here
      },
    },
  });
  return loans;
};
