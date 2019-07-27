const { Client } = require('pg');
const sql = require('sql');
let axios = require('axios');
require('dotenv').config();
let faker = require('faker');
let _ = require('lodash');
let fs = require('fs');
var dataJson = './db/dbData/user.json';

const client = new Client({
    user: "postgres",
    password: "root18",
    host: "localhost",
    port: "5432",
    database: "postgres"
});

let userinfo = sql.define({
    name: 'userinfo',
    columns: [
        'uid',
        'username',
        'city',
        'state',
        'photo',
        'elite',
        'friendcount',
        'reviewcount',
        'photocount'
    ]
});
client.connect()
    .then(() => console.log("Connected sucessfully"))
    .catch(e => console.log(e));

client.query('CREATE TABLE userinfo(uId serial Primary Key, username varchar(500), city varchar(200), state varchar(200), photo varchar(500), elite varchar(200), friendcount integer, reviewcount integer, photocount integer)', (err, res) => {
    if (err) {
        console.log(err);
    }
});

function SaveDB() {
    let config = { headers: { 'X-API-KEY': process.env.UI_FACES_API } };
    axios.get('https://uifaces.co/api?limit=100', config)
        .then(({ data }) => {
            SavePostgress(data)
        })
        .catch((err) => console.log(err));
}

async function SavePostgress(data) {
    let count = 0;
    createUsers(data);
    let user100 = [];
    const userdata = JSON.parse(fs.readFileSync(dataJson, 'utf-8'));
    for (let i = 0; i < 10003000; i++) {
        user100.push(userdata[i]);
        count++;        //
        if (count == 7000) {
            //Save 400k user at  a time in mongo
            await Save100User(user100);
            count = 0;
            user100 = null;
            user100 = [];
        }
    }
} //SavePostgress

async function Save100User(user100) {
    let query = userinfo.insert(user100).returning(userinfo.uid).toQuery();
    await client.query(query, (err, result) => {
        if (err) {
            console.log(err);
        }
        console.log(result);
    })
}

const createUsers = async (data) => {
    let users = [];
    let count = 1;
    console.log(count);
    let eliteStatus = [`Elite '19`, '', ''];
    for (let i = 0; i < 100030; i++) {
        for (let key of data) {
            let user = {
                uid: count,
                username: key.name,
                city: faker.address.city(),
                state: faker.address.stateAbbr(),
                photo: key.photo,
                elite: _.sample(eliteStatus),
                friendcount: _.random(10, 120),
                reviewcount: _.random(10, 400),
                photocount: _.random(10, 400),
            };
            users.push(user);
            count++;
        }
    }
    //console.log(users.length);
    storeData(users, dataJson);
    // return users;
};

const storeData = (data, path) => {
    try {
        console.log("Entered file", path);
        fs.writeFileSync(path, JSON.stringify(data))
    } catch (err) {
        console.error(err)
    }

}

SaveDB();
