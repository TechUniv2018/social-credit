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
];
