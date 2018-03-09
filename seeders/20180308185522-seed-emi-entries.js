

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('emis', [
    {
      loanId: 4,
      userId: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      loanId: 4,
      userId: 5,
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
