const { request, assert } = require("./helper/app");
const { createUser } = require('./helper/student_test_data')
const dbHandler = require('./helper/db-handler')

// Student testing

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

  it("Student bad login", async () => {
    await request.post('/login').send(
      {
        "email": user1.email
      })
      .expect(400)
      .then((res) => {
        assert.deepEqual(res.body, { 'errors': ['Missing password'] })
      })
  });

  it("Student failed login", async () => {

    let expected = { 'auth': false, 'message': 'Error: Incorrect Email or Password' }

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

  //Friend request tests
  let friendRequest, friendRequest2, friendRequest3;
  it("Send a friend request", async () => {
    await request.post('/friend/add').send(
      {
        senderEmail: user1.email,
        receiverEmail: user2.email
      }
    )
      .expect(200)
      .then((res) => {
        assert.deepEqual(res.body.senderEmail, user1.email)
        assert.deepEqual(res.body.receiverEmail, user2.email)
        friendRequest = res.body;
      })
  });

  it("Send a friend request to no one", async () => {
    await request.post('/friend/add').send(
      {
        senderEmail: user1.email,
        receiverEmail: 'does not exist'
      }
    )
      .expect(400)
      .then((res) => {
        assert.deepEqual(res.body, { "errors": ["Receiver does not exist"] })
      })
  });

  it("Send an already existing friend request", async () => {
    await request.post('/friend/add').send(
      {
        senderEmail: user1.email,
        receiverEmail: user2.email
      }
    )
      .expect(400)
      .then((res) => {
        assert.deepEqual(res.body, { "errors": ["Friend request already exists"] })
      })
  });

  it("Get outgoing requests", async () => {
    await request.get('/friend/outgoing-requests/' + user1.email)
      .expect(200)
      .then((res) => {
        assert.deepEqual(res.body, [friendRequest])
      })
  });

  it("Get incoming requests", async () => {
    await request.get('/friend/incoming-requests/' + user2.email)
      .expect(200)
      .then((res) => {
        assert.deepEqual(res.body, [friendRequest])
      })
  });

  it("Cancelling request", async () => {
    await request.post('/friend/cancel-request').send(
      {
        email: user1.email,
        requestId: friendRequest._id
      }
    )
      .expect(200)
      .then((res) => {
        assert.deepEqual(res.body, "Cancelled request to " + user2.email)
      })
  });

  it("Verifying request deletion", async () => {
    await request.get('/friend/outgoing-requests/' + user1.email)
      .expect(200)
      .then((res) => {
        assert.deepEqual(res.body, [])
      })
    await request.get('/friend/incoming-requests/' + user2.email)
      .expect(200)
      .then((res) => {
        assert.deepEqual(res.body, [])
      })
  });

  it("Send new friend requests", async () => {
    await request.post('/friend/add').send(
      {
        senderEmail: user1.email,
        receiverEmail: user2.email
      }
    )
      .expect(200)
      .then((res) => {
        assert.deepEqual(res.body.senderEmail, user1.email)
        assert.deepEqual(res.body.receiverEmail, user2.email)
        friendRequest = res.body;
      })
    await request.post('/friend/add').send(
      {
        senderEmail: user3.email,
        receiverEmail: user2.email
      }
    )
      .expect(200)
      .then((res) => {
        assert.deepEqual(res.body.senderEmail, user3.email)
        assert.deepEqual(res.body.receiverEmail, user2.email)
        friendRequest2 = res.body;
      })
    await request.post('/friend/add').send(
      {
        senderEmail: user1.email,
        receiverEmail: user3.email
      }
    )
      .expect(200)
      .then((res) => {
        assert.deepEqual(res.body.senderEmail, user1.email)
        assert.deepEqual(res.body.receiverEmail, user3.email)
        friendRequest3 = res.body;
      })
  });

  it("Get request by its ID", async () => {
    await request.get('/friend/id/' + friendRequest3._id)
      .expect(200)
      .then((res) => {
        assert.deepEqual(res.body, friendRequest3)
      })
  });

  it("Cancelling wrong request", async () => {
    await request.post('/friend/cancel-request').send(
      {
        email: user2.email,
        requestId: friendRequest._id
      }
    )
      .expect(400)
      .then((res) => {
        assert.deepEqual(res.body, { "errors": ["Not the sender of the request"] })
      })
  });

  it("Answering wrong request", async () => {
    await request.post('/friend/answerFriendRequest').send(
      {
        email: user1.email,
        requestId: friendRequest._id,
        answer: 'accepted'
      }
    )
      .expect(400)
      .then((res) => {
        assert.deepEqual(res.body, { "errors": ["Not the receiver of the request"] })
      })
  });

  it("Answering request", async () => {
    await request.post('/friend/answerFriendRequest').send(
      {
        email: user2.email,
        requestId: friendRequest._id,
        answer: 'accepted'
      }
    )
      //.expect(200)
      .then((res) => {
        console.log(res.body)
        assert.deepEqual(res.body, 'Friend request with ' + user1.email + ' accepted.')
      })
    await request.post('/friend/answerFriendRequest').send(
      {
        email: user2.email,
        requestId: friendRequest2._id,
        answer: 'accepted'
      }
    )
      .expect(200)
      .then((res) => {
        assert.deepEqual(res.body, 'Friend request with ' + user3.email + ' accepted.')
      })
  });

  it("Verifying friends", async () => {
    await request.get('/student/email/' + user1.email)
      .expect(200)
      .then((res) => {
        assert.deepEqual(res.body.email, user1.email)
        assert.deepEqual(res.body.friends, [user2.email])
      })
    await request.get('/student/email/' + user3.email)
      .expect(200)
      .then((res) => {
        assert.deepEqual(res.body.email, user3.email)
        assert.deepEqual(res.body.friends, [user2.email])
      })
    await request.get('/student/email/' + user2.email)
      .expect(200)
      .then((res) => {
        assert.deepEqual(res.body.email, user2.email)
        assert.deepEqual(res.body.friends, [user1.email, user3.email])
      })
  });

  //Delete student tests
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

  it("Verifying friends after student deletion", async () => {
    await request.get('/student/email/' + user3.email)
      .expect(200)
      .then((res) => {
        assert.deepEqual(res.body.email, user3.email)
        assert.deepEqual(res.body.friends, [user2.email])
      })
    await request.get('/student/email/' + user2.email)
      .expect(200)
      .then((res) => {
        assert.deepEqual(res.body.email, user2.email)
        assert.deepEqual(res.body.friends, [user3.email])
      })
  });

  it("Verifying request deletion after student deletion", async () => {
    await request.get('/friend/id/' + friendRequest3._id)
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

