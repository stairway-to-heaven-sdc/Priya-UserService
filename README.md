# Priya-UserService

Get Request
:Gets the user based upon the user id
Path : '/user/:uId'
Postman Response:
http://localhost:3002/user/9

{
    "_id": "5d31403ab7d8a96d8ceb4857",
    "uId": 9,
    "city": "East Georgetteborough",
    "state": "NE",
    "photo": "https://randomuser.me/api/portraits/men/46.jpg",
    "elite": "",
    "friendCount": 25,
    "reviewCount": 309,
    "photoCount": 44,
    "__v": 0
}

Post Request: Add a new USer 
Path :  '/users/newuser/'
  var newUser = {
    uId: 101,
    city: 'Mt.Vernon',
    state: 'NY',
    photo: 'https://randomuser.me/api/portraits/women/68.jpg',
    elite: 'Elite \'19',
    friendCount: 52,
    reviewCount: 10,
    photoCount: 1,
  }
  
  Postman Response 
  http://localhost:3002/users/newuser/
  {
    "_id": "5d314162a17a76e468459918",
    "uId": 101,
    "city": "Mt.Vernon",
    "state": "NY",
    "photo": "https://randomuser.me/api/portraits/women/68.jpg",
    "elite": "Elite '19",
    "friendCount": 52,
    "reviewCount": 10,
    "photoCount": 1,
    "__v": 0
}


PUT Request: Updates the user
Path :  '/users/edituser/:id'
edited the city name
var editUser = {
    uId: 101,
    city: 'Mount.Vernon',
    state: 'NY',
    photo: 'https://randomuser.me/api/portraits/women/68.jpg',
    elite: 'Elite \'19',
    friendCount: 52,
    reviewCount: 10,
    photoCount: 1,
  }
  Postman response 
  http://localhost:3002/users/edituser/5d314162a17a76e468459918

  {
    "_id": "5d314162a17a76e468459918",
    "uId": 101,
    "city": "Mt.Vernon",
    "state": "NY",
    "photo": "https://randomuser.me/api/portraits/women/68.jpg",
    "elite": "Elite '19",
    "friendCount": 52,
    "reviewCount": 10,
    "photoCount": 1,
    "__v": 0
}

Delete Request:Delets a user 
Path :  '/users/deluser/:id'
Postman response 
http://localhost:3002/users/deluser/5d314162a17a76e468459918
{
    "_id": "5d314162a17a76e468459918",
    "uId": 101,
    "city": "Mount.Vernon",
    "state": "NY",
    "photo": "https://randomuser.me/api/portraits/women/68.jpg",
    "elite": "Elite '19",
    "friendCount": 52,
    "reviewCount": 10,
    "photoCount": 1,
    "__v": 0
}
