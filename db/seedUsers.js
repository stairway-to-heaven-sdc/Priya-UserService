let faker = require('faker');
let axios = require('axios');
let _ = require('lodash');
let { saveUsers, deleteAllUser } = require('./dbUsers');
require('dotenv').config();

const seedUsers = () => {
  let config = { headers: { 'X-API-KEY': process.env.UI_FACES_API } };
  axios.get('https://uifaces.co/api?limit=100', config)
    .then(({ data }) => {
      let userList = createUsers(data);
      saveUsers(userList)
        .then((users) => console.log(`Users saved: ${users.length}`))
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

const createUsers = (data) => {
  let users = [];
  let count = 1;
  let eliteStatus = [`Elite '19`, '', ''];
  for (let key of data) {
    let user = {
      uId: count,
      username: key.name,
      city: faker.address.city(),
      state: faker.address.stateAbbr(),
      photo: key.photo,
      elite: _.sample(eliteStatus),
      friendCount: _.random(10, 120),
      reviewCount: _.random(10, 400),
      photoCount: _.random(10, 400),
    };
    users.push(user);
    count++;
  }
  return users;
};

seedUsers();