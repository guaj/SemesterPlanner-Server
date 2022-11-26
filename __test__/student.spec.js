// INCOMPLETE
const { request, assert } = require("./helper/app");
const { createUser } = require('./helper/Student_test_data')
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

describe("Testing student api routes", () => {

  let user1 = createUser();
  let user2 = createUser();
  let user3 = createUser();
  let user4 = createUser();
  let token;

  it("Add a Student", async () => {

    let expected = user1.email

    await request.post('/student/add').send(
      user1
    )
      .expect(200)
      .then((res) => {
        assert.ok(res.body.includes(expected))
      })
  });

  it("Adding a duplicate student", async () => {

    let expected = { 'errors': ['Username already exists', 'Email already exists'] }

    await request.post('/student/add').send(
      user1
    )
      .expect(400)
      .then((res) => {
        assert.deepEqual(res.body, expected)
      })
  });

  it("Adding an invalid student", async () => {

    let expected = { 'errors': ['Missing password'] }

    await request.post('/student/add').send(
      {
        username: user1.username + '_2',
        email: 'test_' + user1.email,

      }
    )
      .expect(400)
      .then((res) => {
        assert.deepEqual(res.body, expected)
      })
  });

  it("Add a second Student", async () => {

    let expected = user2.email

    await request.post('/student/add').send(
      user2)
      .expect(200)
      .then((res) => {
        assert.ok(res.body.includes(expected))
      })
  });

  it("Add a third Student", async () => {

    let expected = user3.email
    await request.post('/student/add').send(
      user3)
      .expect(200)
      .then((res) => {
        assert.ok(res.body.includes(expected))
      })
  });

  it("Add a fourth Student", async () => {

    let expected = user4.email

    await request.post('/student/add').send(
      user4)
      .expect(200)
      .then((res) => {
        assert.ok(res.body.includes(expected))
      })
  });

  it("Get student by email", async () => {

    let expected = user1.email

    await request.get('/student/email/' + expected)
      .expect(200)
      .then((res) => {
        assert.ok(res.body.email.includes(expected))
      })
  });

  it("Get student by username", async () => {

    let expected = user2.username

    await request.get('/student/username/' + expected)
      .expect(200)
      .then((res) => {
        assert.ok(res.body.username.includes(expected))
      })
  });

  it("Student login", async () => {

    let expected = user1.username

    await request.post('/login').send(
      {
        "email": user1.email,
        "password": user1.password
      })
      .expect(200)
      .then((res) => {
        assert.ok(res.body.profile.username.includes(expected))
        token = res.body.token;
      })
  });

  it("Student failed login", async () => {

    let expected = { 'auth': false, 'message': 'Error: Incorrect Username or Password' }

    await request.post('/login').send(
      {
        "email": user1.email,
        "password": "test"
      })
      .expect(401)
      .then((res) => {
        assert.deepEqual(res.body, expected)
      })
  });

  it("Student update", async () => {
    await request.post('/student/update').send(
      {
        email: user2.email,
        program: 'soen'
      }
    )
      .set('authorization', token)
      .expect(200)
      .then((res) => {
        assert.ok(res.body.includes(user2.email))
      })
  });

  it("Update request with missing auth token (not logged in)", async () => {
    await request.post('/student/update').send(
      {
        email: user2.email,
        program: 'coen'
      }
    )
      .expect(401)
      .then((res) => {
        assert.deepEqual(res.body, { auth: false, message: 'No token found in request' })
      })
  });

  it("Send a friend request", async () => {
    await request.post('/friend/add').send(
      {
        senderEmail: user1.email,
        receiverEmail: user2.email
      }
    )
      .expect(200)
      .then((res) => {
        console.log(res.body)
        assert.deepEqual(res.body.senderEmail, user1.email)
        assert.deepEqual(res.body.receiverEmail, user2.email)
      })
  });

  it("Send a friend request to no one", async () => {
    await request.post('/friend/add').send(
      {
        senderEmail: user1.email,
        receiverEmail: 'does not exist'
      }
    )
      .expect(200)
  });

  it("Delete a Student ", async () => {
    let expected = '1 deleted'
    await request.delete('/student/email/' + user1.email)
      .expect(200)
      .then((res) => {
        assert.ok(res.body.includes(expected))
      })

  });

  it("Verifying student deletion", async () => {
    await request.get('/student/email/' + user1.email)
      .expect(200)
      .then((res) => {
        assert.deepEqual(res.body, null)
      })

  });

  it("Delete a non existent student ", async () => {
    await request.delete('/student/email/' + user1.email)
      .expect(400)
      .then((res) => {
        assert.deepEqual(res.body, { 'errors': ['Student does not exist'] });
      })

  });

})

