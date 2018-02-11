const payBackLoan = (userid, loanAmount) => {
  if (['user1', 'user2'].indexOf(userid) >= 0) {
    return Promise.resolve();
  }
  return Promise.reject();
};

module.exports = [
  {
    path: '/api/users/pay-loan',
    method: 'POST',
    handler: (request, response) => {
      const { userid, amount } = request.payload;
      const responseObject = {
        message: '',
      };
      payBackLoan(userid, amount)
        .then(() => {
          responseObject.message = 'Paid';
          response(responseObject).code(201);
        }).catch(() => {
          responseObject.message = 'Not Paid';
          response(responseObject).code(404);
        });
    },
  },
];
