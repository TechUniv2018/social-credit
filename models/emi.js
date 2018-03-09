module.exports = (sequelize, DataTypes) => {
  const emi = sequelize.define('emis', {
    loanId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
  }, {
    classMethods: {
      associate() {
        // associations can be defined here
      },
    },
  });
  return emi;
};
