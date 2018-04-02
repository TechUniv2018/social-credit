const joi = require('joi');

const models = require('../../../../models');

const authHelpers = require('../../../lib/auth-helpers');
const facebookHelpers = require('../../../lib/facebook-helpers');
const { maximumEligibleAmount } = require('../../../lib/loan-helpers');

module.exports = [
  {
    path: '/api/users/loans',
    method: 'GET',
    config: {
      description: 'Retrieve details for all loans requested by a particular user.',
      tags: ['api', 'loans'],
      validate: {
        headers: {
          access_token: joi.string().required(),
        },
        options: {
          allowUnknown: true,
        },
      },
    },
    handler: (request, response) => {
      const inspectionResult = authHelpers.decodeJwtToken(request.headers.access_token);

      if (inspectionResult.userId) {
        return models.users.findById(inspectionResult.userId)
          .then(user => user.loanDetails(models))
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
    },
  },
  {
    path: '/api/users/loans',
    method: 'POST',
    config: {
      description: 'Request for a loan.',
      tags: ['api', 'loans'],
      validate: {
        headers: {
          access_token: joi.string().required(),
        },
        payload: {
          totalAmount: joi.number()
            .min(2500)
            .max(100000)
            .multiple(2500)
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

      const accessToken = request.headers.access_token;
      const inspectionResult = authHelpers.decodeJwtToken(accessToken);
      if (inspectionResult.userId) {
        return Promise.all([
          models.users.findById(inspectionResult.userId),
          models.loans.count({
            where: {
              userId: inspectionResult.userId,
              outstandingAmount: {
                $gt: 0,
              },
            },
          })])
          .then(([user, loansCount]) => {
            if (loansCount > 0) {
              return response({
                statusCode: 400,
                error: 'Bad request',
                message: 'You already have a pending loan.',
              });
            }

            const eligibleAmount = maximumEligibleAmount(user.socialScore);
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
              userId: user.id,
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
    },
  },
];
