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

describe("testing student api routes", () => {

  let user1 = createUser();
  let user2 = createUser();
  let user3 = createUser();
  let user4 = createUser();

  it("add a Student", async () => {

    let expected = user1.username

    await request.post('/student/add').send(
      user1
    )
      .expect(200)
      .expect((res) => {
        assert.ok(res.text.includes(expected))
      })
  });

  it("adding a duplicate student", async () => {

    let expected = "Username already exists"

    await request.post('/student/add').send(
      user1
    )
      .expect(400)
      .expect((res) => {
        assert.ok(res.text.includes(expected))
      })
  });

  it("adding an invalid student", async () => {

    let expected = "Missing password"

    await request.post('/student/add').send(
      {
        username: user1.username + '_2',
        email: 'test_' + user1.email,

      }
    )
      .expect(400)
      .expect((res) => {
        assert.ok(res.text.includes(expected))
      })
  });

  it("add a second Student", async () => {

    let expected = user2.username

    await request.post('/student/add').send(
      user2)
      .expect(200)
      .expect((res) => {
        assert.ok(res.text.includes(expected))
      })
  });

  it("add a third Student", async () => {

    let expected = user3.username
    await request.post('/student/add').send(
      user3)
      .expect(200)
      .expect((res) => {
        assert.ok(res.text.includes(expected))
      })
  });

  it("add a fourth Student", async () => {

    let expected = user4.username

    await request.post('/student/add').send(
      user4)
      .expect(200)
      .expect((res) => {
        assert.ok(res.text.includes(expected))
      })
  });

  it("Get student by email", async () => {

    let expected = user1.email

    await request.get('/student/email/' + expected)
      .expect(200)
      .expect((res) => {
        assert.ok(res.text.includes(expected))
      })
  });

  it("Get student by username", async () => {

    let expected = user2.username

    await request.get('/student/username/' + expected)
      .expect(200)
      .expect((res) => {
        assert.ok(res.text.includes(expected))
      })
  });

  it("student login", async () => {

    let expected = user1.username

    await request.post('/login').send(
      {
        "email": user1.email,
        "password": user1.password
      })
      .expect(200)
      .expect((res) => {
        assert.ok(res.text.includes(expected))
      })
  });

  it("student failed login", async () => {

    let expected = 'Error: Invalid Username or Password'

    await request.post('/login').send(
      {
        "email": user1.email,
        "password": "test"
      })
      .expect(401)
      .expect((res) => {
        assert.ok(res.text.includes(expected))
      })
  });

  it("student login then update", async () => {
    await request.post('/login').send(
      {
        "email": user2.email,
        "password": user2.password
      })
      .expect(200)
      .expect(async (res) => {
        assert.ok(res.text.includes(user2.username))
        await request.post('/student/update').send(
          {
            email: user2.email,
            program: 'soen'
          }
        )
          .set('authorization', JSON.parse(res.text).token)
          .expect(200)
          .expect((res) => {
            assert.ok(res.text.includes(user2.email))
          })
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
      .expect((res) => {
        assert.ok(res.text.includes('No token found in request'))
      })
  });

  it("Send a friend request", async () => {
    await request.post('/friend/add').send(
      {
        username: user1.username,
        friendUsername: user2.username
      }
    )
      .expect(200)
      .expect((res) => {
        assert.ok(res.text.includes('Friendlists updated.'))
      })
  });

  it("Send a friend request to no one", async () => {
    await request.post('/friend/add').send(
      {
        username: user1.username,
        friendUsername: 'does not exist'
      }
    )
      .expect(400)
  });

  it("delete a Student ", async () => {

    let expected = 'deleted 1 student'

    await request.delete('/student/email/' + user1.email)
      .expect(200)
      .expect((res) => {
        assert.ok(res.text.includes(expected))
      })

  });

  it("delete a non existent student ", async () => {

    let expected = 'deleted 0 student'

    await request.delete('/student/email/' + user1.email)
      .expect(200)
      .expect((res) => {
        assert.ok(res.text.includes(expected))
      })

  });

})

