
const models = require('../../../../models');


module.exports = [
  {
    path: '/api/admin/loans',
    method: 'GET',
    config: {
      description: 'Retrieve details for all loans of all the users.',
      tags: ['api'],
    },
    handler: (request, response) =>
      models.loans.findAll({ order: [['outstandingAmount', 'DESC']] })
        .then((allLoans) => {
          const loansMapped = allLoans.map(loan =>
            models.users.findOne({ where: { id: loan.userId } })
              .then(user => models.emi.findAll({ where: { loanId: String(loan.id) } })
                .then(emis =>
                  (
                    {
                      loanId: loan.id,
                      userId: loan.userId,
                      userName: `${user.firstName} ${user.lastName}`,
                      outstandingAmount: loan.outstandingAmount,
                      totalAmount: loan.totalAmount,
                      outstandingInstallments: loan.outstandingInstallments,
                      totalInstallments: loan.totalInstallments,
                      installmentsPaid: emis.map(emi => ({
                        id: emi.id,
                        paymentDate: emi.createdAt,
                      })),
                    }
                  ))));
          Promise.all(loansMapped)
            .then(allLoanDetails =>
              response({
                data: allLoanDetails,
                statusCode: 200,
              }));
        }).catch(() => {
          response({
            data: {
              reason: 'Unable to retrieve loan data.',
            },
            statusCode: 500,
          });
        }),
  },
];
