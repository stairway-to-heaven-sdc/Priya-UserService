const { Pool, Client } = require('pg');
let axios = require('axios');
require('dotenv').config();
let faker = require('faker');
let _ = require('lodash');
let fs = require('fs');
//var dataJson = './db/dbData/user.json';
const path = require('path');
const copyFrom = require('pg-copy-streams').from

var inputFile = path.join(__dirname, '/dbData/test1.csv')
console.log(inputFile);
const client = new Client({
    user: "postgres",
    password: "root18",
    host: "localhost",
    port: "5432",
    database: "postgres"
});

var pool = new Pool();

pool.connect()
    .then(() => console.log("Connected sucessfully"))
    .catch(e => console.log(e));

client.query('CREATE TABLE IF NOT EXISTS  userinfo(uId serial Primary Key, username varchar(500), city varchar(200), state varchar(200), photo varchar(500), elite varchar(200), friendcount integer, reviewcount integer, photocount integer)', (err, res) => {
    if (err) {
        console.log(err);
    }
});

// client.query('CREATE TABLE IF NOT EXISTS  userinfo(uId serial Primary Key, username varchar(500), city varchar(200), phone varchar(50), email varchar(200))', (err, res) => {
//     if (err) {
//         console.log(err);
//     }
// });
var fileStream = fs.createReadStream(inputFile);
fileStream.on('error', (error) => {
    console.log(`Error in reading file: ${error}`);
    //fileStream.destroy();
});

for (let i = 0; i < 20000; i++) {
    var stream = client.query(copyFrom(`COPY userinfo(username, city, state, photo, elite, friendcount, reviewcount, photocount ) FROM '${inputFile}' WITH delimiter ','  CSV HEADER`))
    stream.on('error', (error) => {
        console.log(`Error in copy command: ${error}`)
    })
    stream.on('end', () => {
        console.log(`Completed loading data into userinfo`)
        client.end()
    })
    fileStream.pipe(stream);
}

