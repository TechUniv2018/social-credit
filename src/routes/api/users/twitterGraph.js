const { getFollowersList } = require('../../../lib/twitter-helpers');

const handleRequest = async (screenName) => {
  const followersList = await getFollowersList(screenName);
  const data = followersList.map(follower => ({
    name: follower.name,
    photo: follower.profile_image_url,
    followerCount: follower.followers_count,
  }));
  const nodes = data.map((node, id) => ({
    name: node.name,
    photo: node.photo,
    group: id + 1,
  }));
  const links = data.map((node, id) => ({
    source: 0,
    target: id + 1,
    weight: Math.floor(Math.max(node.followerCount, 1)),
  }));
  nodes.unshift({
    name: screenName,
    photo: '',
    group: 0,
  });
  return {
    nodes,
    links,
  };
};

// const handleRequestMock = async (screenName) => {
//   const data = [
//     {
//       name: 'Melany Kaufman',
//       photo: 'http://pbs.twimg.com/profile_images/734850370854211585/FHjJohWB_normal.jpg',
//       followerCount: 102,
//     },
//     {
//       name: 'udeystar',
//       photo: 'http://pbs.twimg.com/profile_images/3004992110/c527a6b97b92c05913d6e9f7fdffd408_normal.jpeg',
//       followerCount: 188,
//     },
//     {
//       name: 'Joshua Javaheri',
//       photo: 'http://pbs.twimg.com/profile_images/479893834/4829_10100163244129271_2021270_57997270_6877291_n_normal.jpg',
//       followerCount: 377,
//     },
//     {
//       name: 'Tapabrata paul',
//       photo: 'http://pbs.twimg.com/profile_images/3050323914/8fe63ffa95abca08e09c7ef13d949311_normal.jpeg',
//       followerCount: 2,
//     },
//     {
//       name: 'Mario Marro',
//       photo: 'http://pbs.twimg.com/profile_images/1610752248/1383427744suzuki_x-90_suzuki_vitara_x90_1996_128321_5_normal.jpg',
//       followerCount: 164,
//     },
//     {
//       name: 'Nathan Salapat',
//       photo: 'http://pbs.twimg.com/profile_images/455484507542413312/XTkwD_GM_normal.jpeg',
//       followerCount: 323,
//     },
//   ];
//   const nodes = data.map((node, id) => ({
//     name: node.name,
//     photo: node.photo,
//     group: id + 1,
//   }));
//   const links = data.map((node, id) => ({
//     source: 0,
//     target: id + 1,
//     weight: Math.floor(Math.max(node.followerCount, 1)),
//   }));
//   nodes.unshift({
//     name: screenName,
//     photo: '',
//     group: 0,
//   });
//   return {
//     nodes,
//     links,
//   };
// };

module.exports = [
  {
    path: '/api/users/twitterGraph',
    method: 'GET',
    config: {
      description: 'Sends an array of twitter profile pictures and followers',
      tags: ['api', 'users'],
    },
    handler: (request, response) => {
      handleRequest(request.query.screenName)
        .then(response)
        .catch(console.error);
    },
  },
];
