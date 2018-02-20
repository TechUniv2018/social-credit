const model = require('../../../models');

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
            reason: 'Unable to retrieve users.',
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
    },
    handler: (request, reply) => {
      const amountFromAdmin = request.payload.amount;
      const currencyFromAdmin = request.payload.currency;
      model.banks.findOne()
        .then(bankDetails => bankDetails.updateAttributes({
          amount: amountFromAdmin,
          currency: currencyFromAdmin,
        }))
        .then((updatedDetail) => {
          reply({
            data: {
              amount: updatedDetail.amount,
              currency: updatedDetail.currency,
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
