const {registerPayload, loginPayload, deletePayload} =  require("./Student_test_data");
const supertest = require('supertest');
const app = require("../src/server");
const { response } = require("../src/server");
const request = supertest(app)
const assert = require('assert');

//These tests will work locally, but not in CicleCI because we do not have a public API available.
//Change the URL when that is setup.
test("add a new Student ", async () => {



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


test("student login test ", async () => {
  
  expected = "test45"

  await request.post('/login').send(
    { "email":"ram@b.ca",
    "password":"scooby"})
    .expect(200)
    .expect((res) => {
      assert.ok(res.text.includes(expected))
    })
//expect(httpResponse).toBe("test45");
 
});

//works as cleanup of previous test too.
test("delete a Student ", async () => {

  await request.delete('/student/email/ram@b.ca')
  .expect(200)
 });








