


function createUser() {
  return {
    "username": "test_" + (Math.random() + 8).toString(36).substring(2),
    "password": (Math.random() + 8).toString(36).substring(2),
    "faculty": "encs",
    "email": (Math.random() + 8).toString(36).substring(2) + "@test.ca",
    "program": "coen",
    "privateProfile": "true"
  }

}




module.exports = { createUser };