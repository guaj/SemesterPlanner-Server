const {request, assert} =  require("./app");
const {roomdata} =  require("./room_test_data");


//These tests will work locally, but not in CicleCI because we do not have a public API available.
//Change the URL when that is setup.
jest.useRealTimers();
  const random0 = (Math.random() + 8).toString(36).substring(2);
  const random2 = (Math.random() + 7).toString(36).substring(2);
  const random3 = (Math.random() + 6).toString(36).substring(2);
  const random4 = (Math.random() + 4).toString(36).substring(2);

describe("testing student api routes", ()=>{

  

it("add a new Student k;lk;", async () => {
  
    expected ="user_"+random0
  
    await request.post('/student/add').send(
    {"username":"user_"+random0,
    "password":"scooby",
    "faculty":"encs",
    "email":"user_"+random0+"@gmail.com",
    "program":"coen",
    "privateProfile":"true",
    "password":"scooby",
    "friends":["user_"+random2+"@gmail.com", "user_"+random3+"@gmail.com","user_"+random4+"@gmail.com"]
   })
    .expect(200)
    .expect((res) => {
      assert.ok(res.text.includes(expected))
    })
});
  
it("add a new Student ", async () => {
  
  expected ="user_"+random2
  
  await request.post('/student/add').send(
  {"username":"user_"+random2,
  "password":"scooby",
  "faculty":"encs",
  "email":"user_"+random2+"@gmail.com",
  "program":"coen",
  "privateProfile":"true",
  "password":"scooby",
  "friends":["user_"+random0+"@gmail.com", "user_"+random3+"@gmail.com","user_"+random4+"@gmail.com"]
 })
  .expect(200)
  .expect((res) => {
    assert.ok(res.text.includes(expected))
  })
});

it("add a new Student ", async () => {
  
  expected ="user_"+random3
  let arr =["user_"+random2+"@gmail.com", "user_"+random0+"@gmail.com","user_"+random4+"@gmail.com"]
    await request.post('/student/add').send(
    {"username":"user_"+random3,
    "password":"scooby",
    "faculty":"encs",
    "email":"user_"+random3+"@gmail.com",
    "program":"coen",
    "privateProfile":"true",
    "password":"scooby",
    "friends":arr})
  .expect(200)
  .expect((res) => {
    assert.ok(res.text.includes(expected))
  })
});

it("add a new Student ", async () => {
  
  expected ="user_"+random4
  let arr = ["user_"+random2+"@gmail.com", "user_"+random3+"@gmail.com","user_"+random0+"@gmail.com"]
  
    await request.post('/student/add').send(
    {"username":"user_"+random4,
    "password":"scooby",
    "faculty":"encs",
    "email":"user_"+random4+"@gmail.com",
    "program":"coen",
    "privateProfile":"true",
    "password":"scooby",
    "friends":arr
   })
  .expect(200)
  .expect((res) => {
    assert.ok(res.text.includes(expected))
  })
});




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

