const model = require('../../../../models');
const facebookHelpers = require('../../../lib/facebook-helpers');
const joi = require('joi');

module.exports = [
  {
    method: 'POST',
    path: '/api/user/emi',
    config: {
      description: 'Pay the EMI by a particular user',
      tags: ['api'],
      validate: {
        headers: {
          accesstoken: joi.string().required(),
        },
        payload: {
          emi: joi.number().positive().required(),
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
          return model.facebooks.find({
            where: {
              id: inspectionResult.userId,
            },
          })
            .then((facebookUser) => {
              const { userId } = facebookUser;
              const emiAmount = request.payload.emi;
              model.loans.findOne({
                where: {
                  userId,
                  outstandingAmount: {
                    $gt: 0,
                  },
                },
              })
                .then((loanDetails) => {
                  if (loanDetails === null) {
                    response({
                      error: 'No pending loans',
                      message: 'You don\'t have any pending loans.',
                      statusCode: 400,
                    });
                  }
                  if ((loanDetails.outstandingAmount / loanDetails.outstandingInstallments) === emiAmount) {
                    return loanDetails.updateAttributes({
                      outstandingAmount: Number(loanDetails.outstandingAmount) - emiAmount,
                      outstandingInstallments: Number(loanDetails.outstandingInstallments) - 1,
                    })
                      .then(() => model.emi.create({
                        loanId: loanDetails.id,
                        userId: loanDetails.userId,
                      }));
                  }
                  return response({
                    error: 'Bad request',
                    message: 'Invalid emi amount',
                    statusCode: 400,
                  }).done();
                })
                .then(() => {
                  response({
                    data: {
                      message: 'success',
                    },
                    statusCode: 201,
                  });
                }).catch((error) => {
                  response({
                    data: {
                      reason: error.message,
                    },
                    statusCode: 500,
                  });
                });
            });
        }
        return response({
          error: 'Invalid token',
          message: 'Invalid user access token',
          statusCode: 400,
        });
      }),


  },

];
