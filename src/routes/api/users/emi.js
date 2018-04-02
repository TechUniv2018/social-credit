const models = require('../../../../models');
const authHelpers = require('../../../lib/auth-helpers');
const joi = require('joi');

module.exports = [
  {
    method: 'POST',
    path: '/api/users/emi',
    config: {
      description: 'Pay a single installment of a loan.',
      tags: ['api', 'loans'],
      validate: {
        headers: {
          access_token: joi.string().required(),
        },
        payload: {
          amount: joi.number().positive().required(),
        },
        options: {
          allowUnknown: true,
        },
      },
    },
    handler: (request, response) => {
      const inspectionResult = authHelpers.decodeJwtToken(request.headers.access_token);

      if (inspectionResult.userId) {
        const { userId } = inspectionResult;
        const { amount } = request.payload;
        models.loans.findOne({
          where: {
            userId,
            outstandingAmount: {
              $gt: 0,
            },
          },
        })
          .then((loanDetails) => {
            if (loanDetails === null) {
              return response({
                error: 'No pending loans',
                message: 'You don\'t have any pending loans.',
                statusCode: 400,
              });
            } else if ((loanDetails.outstandingAmount /
              loanDetails.outstandingInstallments) === amount) {
              return models.sequelize.transaction(transaction =>
                loanDetails.updateAttributes({
                  outstandingAmount: loanDetails.outstandingAmount - amount,
                  outstandingInstallments: loanDetails.outstandingInstallments - 1,
                }, { transaction })
                  .then(() => models.emis.create({
                    loanId: loanDetails.id,
                    userId: loanDetails.userId,
                  }), { transaction }))
                .then(() => response({
                  statusCode: 201,
                }))
                .catch(() => response({
                  statusCode: 500,
                  error: 'Internal server error',
                  message: 'Could not pay the emi. Something went wrong.',
                }));
            }
            return response({
              error: 'Bad request',
              message: 'Invalid emi amount.',
              statusCode: 400,
            });
          });
      } else {
        return response({
          error: 'Invalid token',
          message: 'Invalid user access token',
          statusCode: 400,
        });
      }
    },
  },
];
