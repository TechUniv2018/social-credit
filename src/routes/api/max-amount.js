const model = require('../../../models');
const joi = require('joi');

module.exports = [
  {
    path: '/api/max-amount',
    method: 'GET',
    config: {
      description: 'Retrieve the bank funds details.',
      tags: ['api'],
    },
    handler: (request, response) => {
      model.banks.findOne().then((bankDetails) => {
        response({
          data: bankDetails,
          statusCode: 200,
        });
      }).catch(() => {
        response({
          data: {
            reason: 'Unable to retrieve bank fund details.',
          },
          statusCode: 500,
        });
      });
    },
  },
  {
    method: 'POST',
    path: '/api/max-amount',
    config: {
      description: 'Update the bank fund details.',
      tags: ['api'],
      validate: {
        payload: {
          amount: joi.number().positive().required(),
          currency: joi.string().required(),
        },
      },
    },
    handler: (request, reply) => {
      const amountFromAdmin = Number(request.payload.amount);
      const currencyFromAdmin = request.payload.currency;
      model.banks.findOne()
        .then(bankDetails => bankDetails.updateAttributes({
          amount: amountFromAdmin,
          currency: currencyFromAdmin,
        }))
        .then(() => {
          reply({
            statusCode: 200,
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
