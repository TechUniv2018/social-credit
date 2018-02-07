module.exports = {
  up: queryInterface => queryInterface.bulkInsert('banks', [
    {
      amount: 5000000,
      currency: 'INR',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),

  down: queryInterface => queryInterface.bulkDelete('banks'),
};
