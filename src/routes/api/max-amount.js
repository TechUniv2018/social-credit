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
// {
//   path: '/api/maxAmount',
//   method: 'PATCH',
//   handler: (request, response) => {
//
//     request({
//       data:
//     })
//     model.banks.findOne().then((bank) => {
//       if (bank === null) {
//    throw new Error(`Could not find bank`);
//     })
//   },
// },
{
  method: 'POST',
  path: '/api/maxAmount',
  handler: (request, reply) => {
    const amountFromAdmin = request.payload.amount;
    const currencyFromAdmin = request.payload.currency;
    // model.banks.destroy({
    //   where: {},
    //   truncate: true,
    // });
    model.banks.findOne().then((bankDetails) => {
      bankDetails.updateAttributes({
        amount: amountFromAdmin,
        currency: currencyFromAdmin,
      });
      const response = reply(`${bankDetails.amount}`);
      // const response = reply(`Amount set: ${amount}\nCurrency set: ${currency}`);
      response.header('Content-Type', 'text/plain');
    });
  },
},
];
