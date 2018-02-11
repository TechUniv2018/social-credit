const userLoansHelper = require('../../../../src/lib/user-helpers').userLoans;

module.exports = [
  {
    path: '/api/users/{userId}/loans',
    method: 'GET',
    handler: (request, response) => {
      const { userId } = request.params;

      userLoansHelper(userId)
        .then((loans) => {
          const loansMapped = loans.map(loan => ({
            id: loan.id,
            installmentCount: loan.installmentCount,
            totalAmount: loan.totalAmount,
            outstandingAmount: loan.outstandingAmount,
            createdAt: loan.createdAt,
          }));

          response({
            data: loansMapped,
            statusCode: 200,
          });
        })
        .catch((e) => {
          response({
            data: {
              reason: e.message,
            },
            statusCode: e.message === 'Invalid userId.' ? 400 : 500,
          });
        });
    },
  },
];
