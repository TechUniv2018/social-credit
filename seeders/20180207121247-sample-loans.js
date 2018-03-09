module.exports = {
  up: queryInterface => queryInterface.bulkInsert('loans', [
    {
      userId: 1,
      totalAmount: 100000,
      outstandingAmount: 110040,
      outstandingInstallments: 12,
      totalInstallments: 12,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      userId: 2,
      totalAmount: 125000,
      outstandingAmount: 122240,
      outstandingInstallments: 16,
      totalInstallments: 18,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      userId: 3,
      totalAmount: 300000,
      outstandingAmount: 316250,
      outstandingInstallments: 23,
      totalInstallments: 24,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      userId: 5,
      totalAmount: 550000,
      outstandingAmount: 605040,
      outstandingInstallments: 12,
      totalInstallments: 12,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),

  down: queryInterface => queryInterface.bulkDelete('loans'),
};
