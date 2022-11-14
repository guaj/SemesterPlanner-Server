// INCOMPLETE
const { request, assert } = require("./helper/app");
const { roomdata } = require("./helper/room_test_data");
const dbHandler = require('./helper/db-handler')

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => {
  await dbHandler.connect()
  await dbHandler.clearDatabase()
});

/**
 * Remove and close the db and server.
 */
afterAll(async () => {
  await dbHandler.closeDatabase();
});

jest.useRealTimers();
const random0 = (Math.random() + 8).toString(36).substring(2);
const random2 = (Math.random() + 7).toString(36).substring(2);
const random3 = (Math.random() + 6).toString(36).substring(2);
const random4 = (Math.random() + 4).toString(36).substring(2);

describe("testing student api routes", () => {

  it("add a new Student", async () => {

    expected = "user_" + random0

    await request.post('/student/add').send(
      {
        "username": "user_" + random0,
        "password": "scooby",
        "faculty": "encs",
        "email": "user_" + random0 + "@gmail.com",
        "program": "coen",
        "privateProfile": "true",
        "friends": ["user_" + random2 + "@gmail.com", "user_" + random3 + "@gmail.com", "user_" + random4 + "@gmail.com"]
      })
      .expect(200)
      .expect((res) => {
        assert.ok(res.text.includes(expected))
      })
  });

  it("add a new Student ", async () => {

    expected = "user_" + random2

    await request.post('/student/add').send(
      {
        "username": "user_" + random2,
        "password": "scooby",
        "faculty": "encs",
        "email": "user_" + random2 + "@gmail.com",
        "program": "coen",
        "privateProfile": "true",
        "friends": ["user_" + random0 + "@gmail.com", "user_" + random3 + "@gmail.com", "user_" + random4 + "@gmail.com"]
      })
      .expect(200)
      .expect((res) => {
        assert.ok(res.text.includes(expected))
      })
  });

  it("add a new Student ", async () => {

    expected = "user_" + random3
    let arr = ["user_" + random2 + "@gmail.com", "user_" + random0 + "@gmail.com", "user_" + random4 + "@gmail.com"]
    await request.post('/student/add').send(
      {
        "username": "user_" + random3,
        "password": "scooby",
        "faculty": "encs",
        "email": "user_" + random3 + "@gmail.com",
        "program": "coen",
        "privateProfile": "true",
        "friends": arr
      })
      .expect(200)
      .expect((res) => {
        assert.ok(res.text.includes(expected))
      })
  });

  it("add a new Student ", async () => {

    expected = "user_" + random4
    let arr = ["user_" + random2 + "@gmail.com", "user_" + random3 + "@gmail.com", "user_" + random0 + "@gmail.com"]

    await request.post('/student/add').send(
      {
        "username": "user_" + random4,
        "password": "scooby",
        "faculty": "encs",
        "email": "user_" + random4 + "@gmail.com",
        "program": "coen",
        "privateProfile": "true",
        "friends": arr
      })
      .expect(200)
      .expect((res) => {
        assert.ok(res.text.includes(expected))
      })
  });

  it("add a new Student ", async () => {

    expected = "Student ram@b.ca added"

    await request.post('/student/add').send(
      {
        "username": "test45",
        "password": "scooby",
        "faculty": "encs",
        "email": "ram@b.ca",
        "program": "coen",
        "privateProfile": "true"
      })
      .expect(200)
      .expect((res) => {
        assert.ok(res.text.includes(expected))
      })
  });


  it("student login test ", async () => {

    expected = "test45"

    await request.post('/login').send(
      {
        "email": "ram@b.ca",
        "password": "scooby"
      })

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

