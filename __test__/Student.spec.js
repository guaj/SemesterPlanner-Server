const {request, assert} =  require("./app");
const {roomdata} =  require("./room_test_data");


//These tests will work locally, but not in CicleCI because we do not have a public API available.
//Change the URL when that is setup.


describe("testing student api routes", ()=>{



  it("add a new Student ", async () => {
  
    expected = "Student ram@b.ca added"
  
    await request.post('/student/add').send(
    {"username":"test45",
    "password":"scooby",
    "faculty":"encs",
    "email":"ram@b.ca",
    "program":"coen",
    "privateProfile":"true",
    "password":"scooby"})
    .expect(200)
    .expect((res) => {
      assert.ok(res.text.includes(expected))
    })
    //expect(httpResponse).toBe("Student ram@b.ca added");
   
  });
  
  
  it("student login test ", async () => {
    
    expected = "test45"
  
    await request.post('/login').send(
      { "email":"ram@b.ca",
      "password":"scooby"})
     
      .expect((res) => {
        assert.ok(res.text.includes(expected))
      })
  //expect(httpResponse).toBe("test45");
  
   
  });
  
  //works as cleanup of previous test too.
  it("delete a Student ", async () => {
  
    await request.delete('/student/email/ram@b.ca')
    .expect(200)
    
   });



})



describe("testing room api routes", ()=>{

   //creating a study room
  it("create a study room", async () => {
  
    await request.post('/room/').send(roomdata)
    .expect(200)

   });

  it("fetching data from study room by sID", async () => {
  
    await request.get('/room/fetch/r9q1yfw32ro')
    .expect(200)

   });


   it("fetching data from study room by email", async () => {
  
    await request.get('/room/fetch/am68gno@gmail.com')
    .expect(200)

   });


   it("add a friend to the study room", async () => {
  
    await request.get('/room/fetch/r9q1yfw32ro')
    .expect(200)

   });


/// delete a study room

  })








