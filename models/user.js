module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    socialScore: DataTypes.INTEGER,
  }, {});

  users.prototype.loanDetails = function loanDetails(models) {
    return models.loans.findAll({
      attributes: [
        'outstandingAmount',
        'totalAmount',
        'createdAt',
        'outstandingInstallments',
        'totalInstallments',
      ],
      where: {
        userId: this.id,
      },
      include: [
        {
          model: models.emis,
          as: 'emis',
          attributes: ['createdAt'],
        },
      ],
    });
  };

  users.associate = (models) => {
    models.users.hasMany(models.loans, { as: 'loans' });
    models.users.hasOne(models.facebooks);
    models.users.hasOne(models.twitters);
  };

  users.newUser = user => users.create(user);
  return users;
};
