const model = require('../../../models');

module.exports = [{
  path: '/api/maxAmount',
  method: 'GET',
  handler: (request, response) => {
    model.banks.findOne().then((bankDetails) => {
      if (bankDetails === null) {
        response('Could not find bank amount');
        throw new Error('Not found');
      }
      response(bankDetails);
    });
  },
},
];
