

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('loans', [
    {
      id: 1,
      userID: 1,
      totalAmount: 10000,
      outstandingAmount: 2000,
      installmentCount: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      userID: 2,
      totalAmount: 20000,
      outstandingAmount: 4000,
      installmentCount: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      userID: 3,
      totalAmount: 20000,
      outstandingAmount: 4000,
      installmentCount: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 4,
      userID: 4,
      totalAmount: 10000,
      outstandingAmount: 2000,
      installmentCount: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),

  down: queryInterface => queryInterface.bulkDelete('loans'),
};
