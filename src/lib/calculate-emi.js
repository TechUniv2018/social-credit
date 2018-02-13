const models = require('../../models');

const calculateEmi = (userId, loanId) => new Promise((resolve, reject) => {
  models.loans.findOne({
    where: {
      id: loanId,
      userId,
    },
  }).then((loan) => {
    if (loan === null) {
      reject(new Error('Invalid Id'));
    }
    const emi = loan.dataValues.totalAmount / loan.dataValues.installmentCount;
    resolve(emi);
  });
});

module.exports = { calculateEmi };
