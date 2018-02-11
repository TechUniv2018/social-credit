const models = require('../../models');

const userLoans = async userId => new Promise((resolve, reject) => {
  models.users.findOne({
    where: {
      id: userId,
    },
  }).then((user) => {
    if (user === null) reject(new Error('Invalid userId.'));

    models.loans.findAll({
      where: {
        userId,
      },
    })
      .then((loans) => {
        resolve(loans);
      });
  });
});

module.exports = {
  userLoans,
};
