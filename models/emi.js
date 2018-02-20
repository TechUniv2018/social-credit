module.exports = (sequelize, DataTypes) => {
  const emi = sequelize.define('emi', {
    loanId: DataTypes.STRING,
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
