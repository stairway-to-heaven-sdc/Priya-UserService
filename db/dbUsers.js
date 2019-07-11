const mongoose = require('mongoose');
require('dotenv').config();
const mongoURI = process.env.MONGOURI || 'mongodb://localhost/fec1';
mongoose.connect(mongoURI, { useNewUrlParser: true });

const usersSchema = new mongoose.Schema({
  uId: Number,
  city: String,
  state: String,
  photo: String,
  elite: String,
  friendCount: Number,
  reviewCount: Number,
  photoCount: Number,
});

const User = mongoose.model('User', usersSchema);

const saveUsers = (data) => {
  return new Promise((resolve, reject) => {
    User.insertMany(data)
      .then((users) => resolve(users))
      .catch((err) => reject(err));
  });
};

const retrieveUsersById = (uIds) => {
  return new Promise((resolve, reject) => {
    User.find({ 'uId': { $in: uIds } })
      .then((users) => resolve(users))
      .catch((err) => reject(err));
  });
};

module.exports.saveUsers = saveUsers;
module.exports.retrieveUsersById = retrieveUsersById;