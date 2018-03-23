/**
 * Takes the social score and returns the max eligible amount
 * @param {Number} socialScore
 * @returns {Number} amount
 */
const maximumEligibleAmount = (socialScore) => {
  if (typeof socialScore !== 'number') {
    return 0;
  }
  const score = Math.min(Math.max(socialScore, 0), 1000);
  return Math.floor((score * 10000) / 25000) * 25000;
};

module.exports = {
  maximumEligibleAmount,
};
