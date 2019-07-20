let faker = require('faker');
let axios = require('axios');
let _ = require('lodash');
let fs = require('fs');
let { saveUsers, deleteAllUser } = require('./dbUsers');
var dataJson = './db/dbData/user.json';//require('./dbData/user.json');
require('dotenv').config();

function seedUsers() {
  // deleteAllUser();
  let config = { headers: { 'X-API-KEY': process.env.UI_FACES_API } };
  axios.get('https://uifaces.co/api?limit=100', config)
    .then(({ data }) => {
      S(data)
    })
    .catch((err) => console.log(err));

};

async function S(data) {
  let count = 0;
  const userdata = JSON.parse(fs.readFileSync(dataJson, 'utf-8'));
  for (let i = 0; i < 25; i++) {
    createUsers(data, i);
    if (count == i) {
      await Save400KUser(userdata);
      count++;
    }
  }
}

async function Save400KUser(userdata) {
  await saveUsers(userdata)
    .then((users) => console.log(`Users saved: ${users.length}`))
    .catch((err) => console.log(err));
}

const storeData = (data, path) => {
  try {
    console.log("Entered file", path);
    fs.writeFileSync(path, JSON.stringify(data))
  } catch (err) {
    console.error(err)
  }

}

const createUsers = async (data, i) => {
  let users = [];
  let count = i * 400000 + 1;
  console.log(count);
  let eliteStatus = [`Elite '19`, '', ''];
  for (let i = 0; i < 4000; i++) {
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
  }
  console.log(users.length);

  storeData(users, dataJson);
  // return users;
};



seedUsers();