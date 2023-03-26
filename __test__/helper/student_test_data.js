const {request} = require("./app");

function createUser() {
  return {
    "username": "test_" + (Math.random() + 8).toString(36).substring(2),
    "password": (Math.random() + 8).toString(36).substring(2),
    "faculty": "encs",
    "email": (Math.random() + 8).toString(36).substring(2) + "@test.ca",
    "program": "coen",
    "privateProfile": true
  }

}

function getUserToken(user) {
  return request.post('/login').send(
      {
        "email": user.email,
        "password": user.password
      })
      .expect(200)
      .then((res) => {
        return res.headers['set-cookie'][0].split(';')[0];
      })
}




module.exports = { createUser, getUserToken };
