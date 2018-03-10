const joi = require('joi');
const models = require('../../../../models');
const facebookHelpers = require('../../../lib/facebook-helpers');
const { maximumEligibleAmount } = require('../../../lib/loan-helpers');

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
            include: [
              {
                model: models.users,
                as: 'user',
              },
            ],
          })
            .then(facebookUser => facebookUser.user.loanDetails(models))
            .then(loans => response({
              data: loans,
              statusCode: 200,
            }));
        }
        return response({
          error: 'Invalid token',
          message: 'Invalid user access token',
          statusCode: 400,
        });
      })
      .catch(response),
  },
  {
    path: '/api/users/loans',
    method: 'POST',
    config: {
      description: 'Request for a loan.',
      tags: ['api'],
      validate: {
        headers: {
          accesstoken: joi.string().required(),
        },
        payload: {
          totalAmount: joi.number()
            .min(100000)
            .max(1000000)
            .multiple(25000)
            .required(),
          totalInstallments: joi.number()
            .min(12)
            .max(36)
            .multiple(6)
            .required(),
        },
        options: {
          allowUnknown: true,
        },
      },
    },
    handler: (request, response) => {
      const totalAmount = Number(request.payload.totalAmount);
      const totalInstallments = Number(request.payload.totalInstallments);

      return facebookHelpers
        .inspectUserAccessToken(request.headers.accesstoken)
        .then((inspectionResult) => {
          if (inspectionResult.isValid) {
            return models.facebooks.findOne({
              where: {
                id: inspectionResult.userId,
              },
              include: [
                {
                  model: models.users,
                  as: 'user',
                },
              ],
            })
              .then(facebookUser => Promise.all([facebookUser,
                models.loans.count({
                  where: {
                    userId: facebookUser.userId,
                    outstandingAmount: {
                      $gt: 0,
                    },
                  },
                })]))
              .then(([facebookUser, loansCount]) => {
                if (loansCount > 0) {
                  return response({
                    statusCode: 400,
                    error: 'Bad request',
                    message: 'You already have a pending loan.',
                  });
                }

                const eligibleAmount = maximumEligibleAmount(facebookUser.user.socialScore);
                if (totalAmount > eligibleAmount) {
                  return response({
                    error: 'Bad request',
                    message: `You are eligible for a maximum loan amount of ${eligibleAmount} INR.`,
                    statusCode: 400,
                  });
                }

                const emi = Math.round(((1.1 * totalAmount) / totalInstallments) / 10) * 10;
                const outstandingAmount = emi * totalInstallments;

                return models.loans.create({
                  userId: facebookUser.userId,
                  totalAmount,
                  totalInstallments,
                  outstandingAmount,
                  outstandingInstallments: totalInstallments,
                })
                  .then(loan => response({
                    data: {
                      totalAmount: loan.totalAmount,
                      outstandingAmount: loan.outstandingAmount,
                      outstandingInstallments: loan.outstandingInstallments,
                      totalInstallments: loan.totalInstallments,
                    },
                    statusCode: 201,
                  }))
                  .catch(response);
              });
          }
          return response({
            error: 'Invalid token',
            message: 'Invalid user access token',
            statusCode: 400,
          });
        })
        .catch(response);
    },
  },
];
