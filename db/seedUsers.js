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
      Save(data)
    })
    .catch((err) => console.log(err));

};

async function Save(data) {
  let count = 0;
  //create the json with 1000000 records
  createUsers(data);
  let user400k = [];
  //parse the json file
  const userdata = JSON.parse(fs.readFileSync(dataJson, 'utf-8'));
  for (let i = 0; i < 10000000; i++) {
    user400k.push(userdata[i]);
    count++;
    //
    if (count == 400000) {
      console.log(user400k.length);
      //Save 400k user at  a time in mongo
      await Save400KUser(user400k);
      count = 0;
      user400k = null;
      user400k = [];
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

const createUsers = async (data) => {
  let users = [];
  let count = 1;
  console.log(count);
  let eliteStatus = [`Elite '19`, '', ''];
  for (let i = 0; i < 10000; i++) {
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
  //console.log(users.length);
  storeData(users, dataJson);
  // return users;
};



seedUsers();