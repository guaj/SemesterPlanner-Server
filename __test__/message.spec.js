// INCOMPLETE
const { request, assert } = require("./helper/app");
const { createRoom } = require("./helper/room_test_data");
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

describe("testing message api routes", () => {

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    function generateString(length) {
        let result = ' ';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }

    let user1 = createUser();
    let user2 = createUser();

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
    });

    let room1 = createRoom(user1.email)
    var room1ID;
    let room2 = createRoom(user1.email)
    var room2ID;
    it("Create 2 study rooms and add student to 1", async () => {

        await request.post('/room/').send(room1)
            .expect(200)
            .then((res) => {
                assert.ok(res.body.owner.includes(user1.email));
                room1ID = res.body.studyRoomID;
            })

        await request.post('/room/').send(room2)
            .expect(200)
            .then((res) => {
                assert.ok(res.body.owner.includes(user1.email));
                room2ID = res.body.studyRoomID;
            })
        await request.get('/room/' + user1.email)
            .expect(200)
            .then((res) => {
                assert.deepEqual(res.body[0].studyRoomID, room1ID);
                assert.deepEqual(res.body[1].studyRoomID, room2ID);
            })
        await request.post('/room/add').send({
            email: user2.email,
            studyRoomID: room1ID
        })
            .expect(200)
            .then((res) => {
                assert.ok(res.body.includes(user2.email))
            })
    });

    //Message creation
    let messageID;
    let randomString = generateString(1000);
    it("Create a message", async () => {
        await request.post('/message/send').send(
            {
                email: user1.email,
                content: randomString,
                studyRoomID: room1ID,
            }
        )
            .expect(200)
            .then((res) => {
                assert.deepEqual(res.body.email, user1.email);
                assert.deepEqual(res.body.content, randomString);
                assert.deepEqual(res.body.studyRoomID, room1ID);
                messageID = res.body.messageID
            })
    });

    it("Get message by messageID", async () => {
        await request.get('/message/' + messageID)
            .expect(200)
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
        )
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
        )
            .expect(400)
            .then((res) => {
                assert.deepEqual(res.body, { "errors": ["Message author does not belong to studyRoom"] });
            })
    });
    it("Create 50 messages", async () => {
        for (i = 0; i < 50; i++) {
            randomString = generateString(1000);
            let user = user1;
            if (Math.round(Math.random()) == 1) { user = user2 }
            await request.post('/message/send').send(
                {
                    email: user.email,
                    content: randomString,
                    studyRoomID: room1ID,
                }
            )
                .expect(200)
                .then((res) => {
                    assert.deepEqual(res.body.email, user.email);
                    assert.deepEqual(res.body.content, randomString);
                    assert.deepEqual(res.body.studyRoomID, room1ID);
                    messageID = res.body.messageID
                })
        }
    });

    //retrieving messages in bulk

})
