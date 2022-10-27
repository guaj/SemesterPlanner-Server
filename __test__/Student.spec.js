const {registerPayload, loginPayload, deletePayload} =  require("./Student_test_data");
const axios = require("axios");
const app = require('../src/server')

//test needs proper server closing. Not a critical issue.
test("add a new Student ", async () => {
  
  let httpResponse = await axios.post('http://localhost:5000/Student/add',registerPayload)
    .then( response =>{
          return response.data
    });
  expect(httpResponse).toBe("Student ram@b.ca added");
 });


test("student login test ", async () => {
  
  let httpResponse = await axios.post('http://localhost:5000/login', loginPayload)
    .then( response =>{
       return response.data.profile.username
     
    });

  expect(httpResponse).toBe("test45");
 
});

//works as cleanup of previous test too.
test("delete a Student ", async () => {
  
  let httpResponse = await axios.delete('http://localhost:5000/student/email/ram@b.ca')
    .then( response =>{
          return response.data
    });
  expect(httpResponse).toBe("Student deleted");
 });








