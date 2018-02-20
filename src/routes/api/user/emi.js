const model = require('../../../../models');
const calculateEmi = require('../../../lib/calculate-emi');

module.exports = [
  {
    method: 'POST',
    path: '/api/user/{userId}/emi/{loanId}',
    handler: (request, reply) => {
      const emiAmount = calculateEmi(request.params.userId, request.params.loanId).then();
      const user = request.params.userId;
      model.loans.findOne({
        where: {
          userId: user,
        },
      })
        .then(loanDetails => loanDetails.updateAttributes({
          outstandingAmount: Number(loanDetails.outstandingAmount) - emiAmount,
        }))
        .then(() => {
          reply({
            data: {
              message: 'success',
            },
            statusCode: 201,
          });
        }).catch((error) => {
          reply({
            data: {
              reason: error.message,
            },
            statusCode: 500,
          });
        });
    },
  },
];
