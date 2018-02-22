const models = require('../../models');

const userLoans = userId => new Promise((resolve, reject) => {
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

const addUser = (facebookUser, socialScore) => {
  return model.users.create({
    firstName: facebookUser.firstName,
    lastName: facebookUser.lastName,
    socialScore,
  });
}

module.exports = {
  userLoans,
  addUser,
};
