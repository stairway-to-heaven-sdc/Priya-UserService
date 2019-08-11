const { Client } = require('pg');
let axios = require('axios');
require('dotenv').config();
console.log(process.env.user);
// const client = new Client({
//     user: process.env.user,
//     password: process.env.password,
//     host: process.env.host,
//     port: process.env.port,
//     database: process.env.database
// });

const client = new Client({
    user: "postgres",
    password: "root18",
    host: "localhost",
    port: "5432",
    database: "postgres"
});

client.connect()
    .then(() => console.log("Connected sucessfully"))
    .catch(e => console.log(e));

const retrieveUsersById = async (data) => {
    return new Promise((resolve, reject) => {
        client.query(`Select * FROM userinfo WHERE uId = ${data}`, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res.rows);
        });
    });
}

const retrieveAllUsers = () => {
    return new Promise((resolve, reject) => {
        client.query(`Select * FROM userinfo order by uid desc LIMIT 10`, (err, res) => {
            if (err) {
                reject(err);
            }
            console.log(res);
            resolve(res.rows);
        });
    });
};

const saveUser = async (data) => {
    return new Promise((resolve, reject) => {
        let sql = `insert into userinfo(buisnessId, username, city, state, photo, elite, friendcount, reviewcount, photocount) values (${data.buisnessId}, '${data.userName}',' ${data.city}', '${data.state}', '${data.photo}', '${data.elite}', ${data.friendCount}, ${data.reviewCount} , ${data.photoCount})`;
        client.query(sql, (err, res) => {
            if (err) {
                reject(err);
            }
            console.log(res);
            resolve(res);
        });
    });
};

const deleteUser = (id) => {
    return new Promise((resolve, reject) => {
        let sql = `delete from userinfo where uid = ${id}`;
        client.query(sql, (err, res) => {
            if (err) {
                reject(err);
            }
            console.log(res);
            resolve(res);
        });
    });
}

const editUser = (id, data) =>{
    return new Promise((resolve, reject) => {
        let sql = `UPDATE userinfo SET buisnessId = ${data.buisnessId}, username='${data.userName}', city='${data.city}', state= '${data.state}', photo= '${data.photo}', elite = '${data.elite}', friendcount = ${data.friendCount}, reviewcount = ${data.reviewCount}, photocount = ${data.photoCount} where uid = ${id}`;
        client.query(sql, (err, res) => {
            if (err) {
                reject(err);
            }
            console.log(res);
            resolve(res);
        });
    });
}


module.exports.retrieveUsersById = retrieveUsersById;
module.exports.retrieveAllUsers = retrieveAllUsers;
module.exports.saveUser = saveUser;
module.exports.deleteUser = deleteUser;
module.exports.editUser = editUser;