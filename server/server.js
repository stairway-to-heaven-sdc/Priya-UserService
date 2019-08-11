const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3002;
const { retrieveByBiz, retrieveByUser, retrieve1Review } = require('../db/dbReviews');
// const { saveUser, retrieveUsersById, retrieveAllUsers, deleteUser, editUser } = require('../db/dbUsers');
const { retrieveUsersById, retrieveAllUsers, saveUser, deleteUser, editUser } = require('../db/dbPostgressUser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/reviews/business/:bId', (req, res) => {
  let { bId } = req.params; retrieveByBiz(bId).then((reviews) => {
    res.send({ reviews });
  })
    .catch((err) => console.log(err));
});

app.get('/reviews/user/:uId', (req, res) => {
  let { uId } = req.params;
  retrieveByUser(uId).then((reviews) => {
    res.send({ reviews });
  })
    .catch((err) => console.log(err));
});

app.get('/reviews/search/:bId', (req, res) => {
  let { bId } = req.params;
  retrieveByBiz(bId).then((reviews) => {
    // Search review text within each review and return

    res.send({ reviews });
  })
    .catch((err) => console.log(err));
});

app.get('/reviews/summation/:bId', (req, res) => {
  let { bId } = req.params;
  retrieveByBiz(bId).then((reviews) => {
    let reviewCount = reviews.length;
    let rating = reviews.reduce((acc, val) => {
      return acc + val.rating;
    }, 0);
    res.send({ reviewCount, rating });
  })
    .catch((err) => console.log(err));
});

// app.get('/users/', (req, res) => {
//   let { uIds } = req.query;
//   retrieveUsersById(uIds)
//   .then((users) => {
//     res.send(users);
//   })
//   .catch((err) => console.log(err));
// });

//Read
app.get('/user/:uId', (req, res) => {
  let { uId } = req.params;
  retrieveUsersById([uId])
    .then((user) => {
      debugger;
      console.log(user);
      res.send(user[0]);
    })
    .catch((err) => console.log(err));
});

app.get('/alluser/', (req, res) => {
  retrieveAllUsers()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => console.log(err));
});

//Add user 
app.post('/users/newuser/', (req, res) => {
  var newUser = {
    buisnessId: 101,
    userName: "Alex Telsa",
    city: 'Mt.Vernon',
    state: 'NY',
    photo: 'https://randomuser.me/api/portraits/women/68.jpg',
    elite: 'Elite 19',
    friendCount: 52,
    reviewCount: 10,
    photoCount: 1,
  }
  saveUser(newUser)
    .then((users) => {
      res.send(users);
    })
    .catch((err) => console.log(err));
});

//Delete user 
app.delete('/users/deluser/:id', (req, res) => {
  console.log(req.params);
  let id = req.params.id;
  deleteUser(id)
    .then((userDeleted) => {
      res.send(userDeleted);
    })
    .catch((err) => console.log(err));
});

//Edit user 
app.put('/users/edituser/:id', (req, res) => {
  console.log(req.params);
  let id = req.params.id;
  var newUser = {
    buisnessId: 102,
    userName: "Priya Raj",
    city: 'Mount.Vernon',
    state: 'NY',
    photo: 'https://randomuser.me/api/portraits/women/68.jpg',
    elite: 'Elite 19',
    friendCount: 52,
    reviewCount: 10,
    photoCount: 1,
  }
  editUser(id, newUser)
    .then((userEdited) => {
      res.send(userEdited);
    })
    .catch((err) => console.log(err));
});

app.listen(port, () => console.log(`App listening on port: ${port}`));