

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('emis', [
    {
      loanId: 2,
      userId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      loanId: 2,
      userId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      loanId: 3,
      userId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),

  down: queryInterface => queryInterface.bulkDelete('emis', {
    where: {
      loanId: 4,
      userId: 5,
    },
  }),
};
