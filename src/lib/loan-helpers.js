const maximumEligibleAmount = (socialScore) => {
  if (typeof socialScore !== 'number' ||
    socialScore < 0 ||
    socialScore > 100) return undefined;
  return Math.floor((socialScore * 10000) / 25000) * 25000;
};

module.exports = {
  maximumEligibleAmount,
};
