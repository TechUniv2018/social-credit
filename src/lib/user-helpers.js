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

const fetchDataFromUserTable = userId => models.users.findOne({
  where: {
    id: userId,
  },
});

const addUser = (facebookUser, socialScore) => models.users.create({
  firstName: facebookUser.firstName,
  lastName: facebookUser.lastName,
  socialScore,
});

const createSocialEntry = (social, id, userId) => models[social].findOrCreate({
  where: { id },
  defaults: { userId },
});

module.exports = {
  addUser,
  createSocialEntry,
  userLoans,
  fetchDataFromUserTable,
};
