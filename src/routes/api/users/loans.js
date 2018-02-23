const joi = require('joi');

const models = require('../../../../models');
const userLoansHelper = require('../../../../src/lib/user-helpers').userLoans;
const facebookHelpers = require('../../../lib/facebook-helpers');

module.exports = [];
const loans = [
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
    handler: (request, response) => {
      facebookHelpers.inspectUserAccessToken(request.headers.accesstoken)
        .then((inspectionResult) => {
          if (inspectionResult.isValid) {
            models.facebooks.find({
              where: {
                userId: inspectionResult.userId,
              },
            })
              .then(facebookUser => models.users.find({
                where: {
                  id: facebookUser.userId,
                },
              }))
              .then((user) => {
                userLoansHelper(user.id)
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
                  })
                  .catch(() => {
                    response({
                      data: {
                        reason: 'Invalid user access token',
                      },
                      statusCode: 400,
                    });
                  });
              });
          }
        })
        .catch(() => {
          response({
            error: 'Unable to retrieve user loans.',
            statusCode: 500,
          });
        });
    },
  },
  {
    path: '/api/users/loans',
    method: 'POST',
    config: {
      description: 'DEBUG: Add a new loan entry for a particular user.',
      tags: ['api'],
      validate: {
        payload: {
          data: joi.object({
            userId: joi.number().required(),
            outstandingAmount: joi.number().required(),
            outstandingInstallments: joi.number().required(),
            totalAmount: joi.number().required(),
            totalInstallments: joi.number().required(),
          }).required(),
        },
      },
    },
    handler: (request, response) => {
      models.loans.create(request.payload.data)
        .then(() => {
          response({
            statusCode: 201,
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
