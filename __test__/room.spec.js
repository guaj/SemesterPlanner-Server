const {roomdata} =  require("./room_test_data");
const supertest = require('supertest');
const app = require("../src/server");
const { response } = require("../src/server");
const request = supertest(app)
const assert = require('assert')


//create a room
test("add a new room ", async () => {
  

  
    await request.post('/').send(roomdata)
    .expect(200)
    
    //expect(httpResponse).toBe("Student ram@b.ca added");
   });
  


//get request with email


//get request with sID


// delete request with email
