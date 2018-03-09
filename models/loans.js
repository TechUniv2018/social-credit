module.exports = (sequelize, DataTypes) => {
  const loans = sequelize.define('loans', {
    userId: DataTypes.INTEGER,
    outstandingAmount: DataTypes.FLOAT,
    totalAmount: DataTypes.FLOAT,
    outstandingInstallments: DataTypes.INTEGER,
    totalInstallments: DataTypes.INTEGER,
  }, {});

  loans.associate = (models) => {
    loans.emis = models.loans.hasMany(models.emis, { as: 'emis' });
  };

  return loans;
};
