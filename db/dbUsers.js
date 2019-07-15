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

// const saveUsers = (data) => {
//   return new Promise((resolve, reject) => {
//     User.insertMany(data)
//       .then((users) => resolve(users))
//       .catch((err) => reject(err));
//   });
// };

//Add
const saveUser = (data) => {
  let newUser = new User(data);
  return new Promise((resolve, reject) => {
    newUser.save()
      .then((users) => resolve(users))
      .catch((err) => reject(err));
  });
};

//Get 
const retrieveAllUsers = (uIds) => {
  return new Promise((resolve, reject) => {
    User.find({})
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

//Delete
const deleteUser = (id) => {
  return new Promise((resolve, reject) => {
    User.findByIdAndRemove({ '_id': id })
      .then((user) => resolve(user))
      .catch((err) => reject(err));
  });
}

//Edit
const editUser = (id, editInfo) => {
  console.log(id, 'edit');
  return new Promise((resolve, reject) => {
    User.findByIdAndUpdate(id, editInfo)
      .then((user) => resolve(user))
      .catch((err) => reject(err));
  });
}

module.exports.saveUser = saveUser;
module.exports.retrieveUsersById = retrieveUsersById;
module.exports.retrieveAllUsers = retrieveAllUsers;
module.exports.deleteUser = deleteUser;
module.exports.editUser = editUser;

