module.exports = (sequelize, DataTypes) => {
  const twitters = sequelize.define('twitters', {
    id: {
      type: DataTypes.STRING(20),
      primaryKey: true,
    },
    userId: DataTypes.INTEGER,
  }, {
    classMethods: {
      associate() {
        // associations can be defined here
      },
    },
  });

  twitters.newTwitter = async (userId, id) => {
    const twitterRow = await twitters.findOne({
      where: { userId },
    });

    if (twitterRow === null) {
      return twitters.create({
        userId,
        id,
      });
    }
    return twitterRow;
  };

  return twitters;
};
