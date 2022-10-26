const {registerPayload, loginPayload} =  require("./Student_test_data");
const axios = require("axios");


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









