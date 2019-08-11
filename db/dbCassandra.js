const cassandra = require('cassandra-driver');
const path = require('path');
let axios = require('axios');
require('dotenv').config();
let faker = require('faker');
let _ = require('lodash');
let fs = require('fs');
const { exec } = require('child_process');
let date1;
let date2;

var inputFile = `${path.join(__dirname, '/dbData/test1.csv')}`;
console.log(inputFile);
const writeUsers = fs.createWriteStream(inputFile);
writeUsers.write('uId,username,city,state,photo,elite,friendcount,reviewcount,photocount\n', 'utf8');


const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], localDataCenter: 'datacenter1' });

function SaveDB() {
    // makes api call to get images
    let config = { headers: { 'X-API-KEY': process.env.UI_FACES_API } };
    axios.get('https://uifaces.co/api?limit=10', config)
        .then(({ data }) => {
            date1 = new Date();
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
            let uId = i;
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
            const data = `${uId},${username},${city},${state},${photo},${elite},${friendcount},${reviewcount},${photocount}\n`;
            if (i === 0) {
                writer.write(data, encoding, callback);
                console.log("End file write");
                //calls the method to save to postgress once done creating csv
                SaveToCasandra();
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

function SaveToCasandra() {
    client.connect()
        .then(function () {
            const query = "CREATE KEYSPACE IF NOT EXISTS sdc WITH replication =" +
                "{'class': 'SimpleStrategy', 'replication_factor': '3' }";
            return client.execute(query);
        })
        .then(function () {
            const query = "CREATE TABLE IF NOT EXISTS sdc.user (uId int PRIMARY KEY, username text, city text, state text, photo text, elite text, friendcount int, reviewcount int, photocount int)";
            return client.execute(query);
        })
        .then(function () {
            let sqlString = `Copy sdc.user (uId, username, city, state, photo, elite, friendcount, reviewcount, photocount) FROM '${inputFile}' WITH  HEADER = true;`
            exec(`cqlsh 127.0.0.1 9042 -e "${sqlString}"`, (err, out) => {
                if (err) {
                    //  console.error(err);
                } else {
                    console.log(out);
                    date2 = new Date();
                    console.log(date1);
                    console.log(date2);
                    var res = Math.abs(date2 - date1) / 1000;
                    var minutes = Math.floor(res / 60) % 60;
                    console.log(`Total time to load 10miiliom record is ${minutes}min`);
                }
            });
        }).
        catch(function (err) {
            console.log(err);
        })
}

SaveDB();