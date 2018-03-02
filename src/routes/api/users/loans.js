const joi = require('joi');

const models = require('../../../../models');
const userLoansHelper = require('../../../../src/lib/user-helpers').userLoans;
const facebookHelpers = require('../../../lib/facebook-helpers');

module.exports = [
  {
    path: '/api/users/loans',
    method: 'GET',
    config: {
      description: 'Retrieve details for all loans requested by a particular user.',
      tags: ['api'],
      validate: {
        headers: {
          accesstoken: joi.string().required(),
        },
        options: {
          allowUnknown: true,
        },
      },
    },
    handler: (request, response) => facebookHelpers
      .inspectUserAccessToken(request.headers.accesstoken)
      .then((inspectionResult) => {
        if (inspectionResult.isValid) {
          return models.facebooks.find({
            where: {
              id: inspectionResult.userId,
            },
          })
            .then(facebookUser => userLoansHelper(facebookUser.userId))
            .then((loans) => {
              const loansMapped = loans.map(loan => ({
                id: loan.id,
                totalAmount: loan.totalAmount,
                outstandingAmount: loan.outstandingAmount,
                createdAt: loan.createdAt,
              }));

              response({
                data: loansMapped,
                statusCode: 200,
              });
            });
        }
        return response({
          error: 'Invalid token',
          message: 'Invalid user access token',
          statusCode: 400,
        });
      })
      .catch(response),
  },
];
