const model = require('../../../models');

module.exports = [{
  path: '/api/maxAmount',
  method: 'GET',
  handler: (request, response) => {
    model.banks.findOne().then((bankDetails) => {
      response(bankDetails);
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
  path: '/api/maxAmount',
  handler: (request, reply) => {
    const amountFromAdmin = request.payload.amount;
    const currencyFromAdmin = request.payload.currency;
    model.banks.findOne().then((bankDetails) => {
      bankDetails.updateAttributes({
        amount: request.payload.amount,
        currency: request.payload.currency,
      });
      const response = reply(`Amount set: ${amountFromAdmin}\nCurrency set: ${currencyFromAdmin}`);
      response.header('Content-Type', 'text/plain');
    }).catch(() => {
      reply({
        data: {
          reason: 'Unable to post',
        },
        statusCode: 500,
      });
    });
  },
},
];
