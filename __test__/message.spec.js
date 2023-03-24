const { request, assert, generateString } = require("./helper/app");
const { createRoom } = require("./helper/room_test_data");
const { createUser, getUserToken} = require('./helper/student_test_data')
const dbHandler = require('./helper/db-handler')

// Message testing

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

describe("testing message api routes", () => {


    let user1 = createUser();
    let user2 = createUser();
    let token;

    // Pre-test setups creation
    it("Create 2 students", async () => {

        await request.post('/student/add').send(
            user1
        )
            .expect(200)
            .then((res) => {
                assert.ok(res.body.includes(user1.email))
            })
        await request.post('/student/add').send(
            user2
        )
            .expect(200)
            .then((res) => {
                assert.ok(res.body.includes(user2.email))
            })
        await getUserToken(user1).then((res) => {token = res})
    });

    let room1 = createRoom(user1.email)
    let room1ID;
    let room2 = createRoom(user1.email)
    let room2ID;
    it("Create 2 study rooms and add student to 1", async () => {

        await request.post('/room/').send(room1).set('cookie', token)
            .expect(200)
            .then((res) => {
                assert.ok(res.body.owner.includes(user1.email));
                room1ID = res.body.studyRoomID;
            })

        await request.post('/room/').send(room2).set('cookie', token)
            .expect(200)
            .then((res) => {
                assert.ok(res.body.owner.includes(user1.email));
                room2ID = res.body.studyRoomID;
            })
        await request.get('/room/' + user1.email)
            .expect(200).set('cookie', token)
            .then((res) => {
                assert.deepEqual(res.body[0].studyRoomID, room1ID);
                assert.deepEqual(res.body[1].studyRoomID, room2ID);
            })
        await request.post('/room/add').send({
            email: user2.email,
            studyRoomID: room1ID
        }).set('cookie', token)
            .expect(200)
            .then((res) => {
                assert.ok(res.body.includes(user2.email))
            })
    });

    //Message creation
    let messageID;
    let randomString = generateString(1000);
    let messages = []
    it("Create a message", async () => {
        await request.post('/message/send').send(
            {
                email: user1.email,
                content: randomString,
                studyRoomID: room1ID,
            }
        ).set('cookie', token)
            .expect(200)
            .then((res) => {
                assert.deepEqual(res.body.email, user1.email);
                assert.deepEqual(res.body.content, randomString);
                assert.deepEqual(res.body.studyRoomID, room1ID);
                messageID = res.body.messageID
                messages.unshift(res.body)
            })
    });

    it("Get message by messageID", async () => {
        await request.get('/message/' + messageID)
            .expect(200).set('cookie', token)
            .then((res) => {
                assert.deepEqual(res.body.email, user1.email);
                assert.deepEqual(res.body.content, randomString);
                assert.deepEqual(res.body.studyRoomID, room1ID);
            })
    });
    it("Create a message with bad data", async () => {
        await request.post('/message/send').send(
            {
                email: generateString(10),
                content: generateString(5000),
                studyRoomID: generateString(10),
            }
        ).set('cookie', token)
            .expect(400)
            .then((res) => {
                assert.deepEqual(res.body, { "errors": ["Message author does not exist", "Message content exceeds 4096 characters", "StudyRoom does not exist"] });
            })
    });
    it("Try to send a message to a room that the student does not belong in", async () => {
        await request.post('/message/send').send(
            {
                email: user2.email,
                content: generateString(500),
                studyRoomID: room2ID,
            }
        ).set('cookie', token)
            .expect(400)
            .then((res) => {
                assert.deepEqual(res.body, { "errors": ["Message author does not belong to studyRoom"] });
            })
    });


    it("Create 50 messages", async () => {
        for (let i = 0; i < 50; i++) {
            randomString = generateString(1000);
            let user = user1;
            if (Math.round(Math.random()) === 1) { user = user2 }
            await request.post('/message/send').send(
                {
                    email: user.email,
                    content: randomString,
                    studyRoomID: room1ID,
                }
            ).set('cookie', token)
                .expect(200)
                .then((res) => {
                    assert.deepEqual(res.body.email, user.email);
                    assert.deepEqual(res.body.content, randomString);
                    assert.deepEqual(res.body.studyRoomID, room1ID);
                    messages.unshift(res.body);
                })
        }
    });

    //retrieving messages in bulk
    it("Retrieve 60 most recent messages", async () => {
        await request.get('/message/bulk/' + room1ID + '/60')
            .expect(200).set('cookie', token)
            .then((res) => {
                assert.equal(res.body.length, 51)
                assert.deepEqual(res.body, messages);
            })
    });

    it("Retrieve 40 most recent messages past the first 20", async () => {
        messages.splice(0, 20)
        await request.get('/message/bulk/' + room1ID + '/40/20')
            .expect(200).set('cookie', token)
            .then((res) => {
                assert.equal(res.body.length, 31)
                assert.deepEqual(res.body, messages);
            })
    });

    it("Retrieve bulk route with a bad amount", async () => {
        messages.splice(0, 20)
        await request.get('/message/bulk/' + room1ID + '/-60/')
            .expect(400).set('cookie', token)
            .then((res) => {
                assert.deepEqual(res.body, { "errors": ["Amount less than 1"] });
            })
    });

    it("Retrieve bulk route with a bad amount and ignore", async () => {
        messages.splice(0, 20)
        await request.get('/message/bulk/' + room1ID + '/-60/asd')
            .expect(400).set('cookie', token)
            .then((res) => {
                assert.deepEqual(res.body, { "errors": ["Amount less than 1", "Ignore is not a number"] });
            })
    });
})

