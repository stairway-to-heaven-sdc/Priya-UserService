const { Pool, Client } = require('pg');
let axios = require('axios');
require('dotenv').config();
let faker = require('faker');
let _ = require('lodash');
let fs = require('fs');
const path = require('path');
var inputFile = path.join(__dirname, '/dbData/test2.csv');

const writeUsers = fs.createWriteStream(inputFile);
writeUsers.write('username,city,state,photo,elite,friendcount,reviewcount,photocount\n', 'utf8');

function SaveDB() {
    // makes api call to get images
    let config = { headers: { 'X-API-KEY': process.env.UI_FACES_API } };
    axios.get('https://uifaces.co/api?limit=10', config)
        .then(({ data }) => {
            writeTenMillionUsers(writeUsers, 'utf-8', data, () => {
                writeUsers.end()
            });
        })
        .catch((err) => console.log(err));
}

//Creates a 10 million csv file 
function writeTenMillionUsers(writer, encoding, apiData, callback) {
    let i = 10000000;
    let userNameArray = [];
    let photoArray = [];
    let j = 10;
    let eliteStatus = [`Elite '19`, "", `Elite '20`];
    for (var key in apiData) {
        userNameArray.push(apiData[key].name);
        photoArray.push(apiData[key].photo);
    }
    function write() {
        let ok = true;
        do {
            i -= 1;
            if (j <= 0) {
                j = 10;
            }
            j -= 1;
            let uName = userNameArray[j].trim();
            let uPhoto = photoArray[j].trim();
            let username = uName;
            let city = faker.address.city();
            let state = faker.address.stateAbbr();
            let photo = uPhoto;
            let elite = _.sample(eliteStatus);
            let friendcount = _.random(10, 120);
            let reviewcount = _.random(10, 400);
            let photocount = _.random(10, 400);
            const data = `${username},${city},${state},${photo},${elite},${friendcount},${reviewcount},${photocount}\n`;
            if (i === 0) {
                writer.write(data, encoding, callback);
                console.log("End file write");
                //calls the method to save to postgress once done creating csv
                SaveToPostgres();
            } else {
                // see if we should continue, or wait
                // don't pass the callback, because we're not done yet.
                ok = writer.write(data, encoding);
            }
        } while (i > 0 && ok);
        if (i > 0) {
            // had to stop early!
            // write some more once it drains
            writer.once('drain', write);
        }
    }
    write();
}

function SaveToPostgres() {
    const client = new Client({
        user: "postgres",
        password: "root18",
        host: "localhost",
        port: "5432",
        database: "postgres"
    });

    //Conects to postgress servers
    client.connect()
        .then(() => console.log("Connected sucessfully"))
        .catch(e => console.log(e));

    client.query('CREATE TABLE IF NOT EXISTS  userinfo(uId serial Primary Key, username varchar(500), city varchar(200), state varchar(200), photo varchar(500), elite varchar(200), friendcount integer, reviewcount integer, photocount integer)', (err, res) => {
        if (err) {
            console.log(err);
        }
    });

    //copys the data from csv to postgress using the copy command
    client.query(`COPY userinfo(username, city, state, photo, elite, friendcount, reviewcount, photocount ) FROM '${inputFile}' WITH delimiter ','  CSV HEADER`, (err, res) => {
        if (err) {
            console.log(err);
        }
        console.log("done with csv");
    });

}

SaveDB();
