module.exports = (sequelize, DataTypes) => {
  const loans = sequelize.define('loans', {
    userId: DataTypes.INTEGER,
    outstandingAmount: DataTypes.FLOAT,
    totalAmount: DataTypes.FLOAT,
    outstandingInstallments: DataTypes.INTEGER,
    totalInstallments: DataTypes.INTEGER,
  }, {
    classMethods: {
      associate() {
        // associations can be defined here
      },
    },
  });
  return loans;
};
