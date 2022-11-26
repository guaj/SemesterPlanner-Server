// INCOMPLETE
const { request, assert } = require("./helper/app");
const { createRoom } = require("./helper/room_test_data");
const { createUser } = require('./helper/Student_test_data')
const dbHandler = require('./helper/db-handler')

// TODO: Test deleting a room.
// TODO: Proper documentation

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

describe("testing room api routes", () => {

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
    let user3 = createUser();
    let user4 = createUser();

    // Pre-test user creation
    it("Create 4 students", async () => {

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
        await request.post('/student/add').send(
            user3
        )
            .expect(200)
            .then((res) => {
                assert.ok(res.body.includes(user3.email))
            })
        await request.post('/student/add').send(
            user4
        )
            .expect(200)
            .then((res) => {
                assert.ok(res.body.includes(user4.email))
            })
    });

    let room1 = createRoom(user1.email)
    var room1ID;

    // Studyroom creation tests
    it("Create a study room", async () => {

        await request.post('/room/').send(room1)
            .expect(200)
            .then((res) => {
                assert.ok(res.body.owner.includes(user1.email))
            })

    });

    it("Bad study room create request", async () => {

        let expected = {
            "errors": [
                "Owner does not exist",
                "Room title length exceeds 128 characters",
                "Room description length exceeds 2048 characters",
                "Invalid hex color"
            ]
        }
        await request.post('/room/').send({
            owner: generateString(10),
            color: generateString(10),
            description: generateString(2100),
            title: generateString(150),
        })
            .expect(400)
            .then((res) => {
                assert.deepEqual(res.body, expected)
            })

    });

    it("Get room by email", async () => {
        await request.get('/room/' + user1.email)
            .expect(200)
            .then((res) => {
                assert.ok(res.body[0].owner.includes(room1.owner));
                room1ID = res.body[0].studyRoomID;
            })
    });

    it("Get room by studyRoomID", async () => {
        await request.get('/room/fetch/' + room1ID)
            .expect(200)
            .then((res) => {
                assert.ok(res.body.studyRoomID.includes(room1ID));
            })
    });

    it("Verifying owner's participating rooms", async () => {
        await request.get('/student/email/' + user1.email)
            .expect(200)
            .then((res) => {
                assert.deepEqual(res.body.studyRooms, [room1ID]);
            })
    });


    //Adding and removing students from studyroom tests
    it("Add students to the studyRoom", async () => {

        await request.post('/room/add').send({
            email: user2.email,
            studyRoomID: room1ID
        })
            .expect(200)
            .then((res) => {
                assert.ok(res.body.includes(user2.email))
            })
        await request.post('/room/add').send({
            email: user3.email,
            studyRoomID: room1ID
        })
            .expect(200)
            .then((res) => {
                assert.ok(res.body.includes(user3.email))
            })
        await request.post('/room/add').send({
            email: user4.email,
            studyRoomID: room1ID
        })
            .expect(200)
            .then((res) => {
                assert.ok(res.body.includes(user4.email))
            })

    });

    it("Verifying studyRoom participants", async () => {
        let participants = [user1.email, user2.email, user3.email, user4.email];
        await request.get('/room/fetch/' + room1ID)
            .expect(200)
            .then((res) => {
                assert.deepEqual(res.body.participants, participants);
            })
    });

    it("Verifying student's participating rooms", async () => {
        await request.get('/student/email/' + user2.email)
            .expect(200)
            .then((res) => {
                assert.deepEqual(res.body.studyRooms, [room1ID]);
            })
    });

    it("Add duplicate student to studyRoom", async () => {

        await request.post('/room/add').send({
            email: user2.email,
            studyRoomID: room1ID
        })
            .expect(400)
            .then((res) => {
                assert.deepEqual(res.body, { errors: ['Student is already present in studyroom'] })
            })
    })

    it("Add non existent student to nonexistent room", async () => {

        await request.post('/room/add').send({
            email: generateString(10),
            studyRoomID: generateString(10)
        })
            .expect(400)
            .then((res) => {
                assert.deepEqual(res.body, { "errors": ["Student does not exist", "StudyRoom does not exist"] })
            })
    })

    it("Removing student from studyRoom", async () => {
        await request.post('/room/remove').send({
            email: user3.email,
            studyRoomID: room1ID
        })
            .expect(200)
            .then((res) => {
                assert.ok(res.body.includes(user3.email + " removed from studyroom"));
            })
    });

    it("Verifying studyRoom participants", async () => {
        let participants = [user1.email, user2.email, user4.email];
        await request.get('/room/fetch/' + room1ID)
            .expect(200)
            .then((res) => {
                assert.deepEqual(res.body.participants, participants);
            })
    });

    it("Verifying student's participating rooms", async () => {
        await request.get('/student/email/' + user3.email)
            .expect(200)
            .then((res) => {
                assert.deepEqual(res.body.studyRooms, []);
            })
    });

    it("Removing a student already not in studyroom", async () => {
        await request.post('/room/remove').send({
            email: user3.email,
            studyRoomID: room1ID
        })
            .expect(400)
            .then((res) => {
                assert.deepEqual(res.body, { 'errors': ['Student is not in the studyRoom'] });
            })
    });

    it("Removing a the owner from a studyRoom", async () => {
        await request.post('/room/remove').send({
            email: user1.email,
            studyRoomID: room1ID
        })
            .expect(400)
            .then((res) => {
                assert.deepEqual(res.body, { 'errors': ['Cannot remove the owner from the studyRoom'] });
            })
    });


    it("Removing a nonexistent student from a nonexistent room", async () => {
        await request.post('/room/remove').send({
            email: generateString(10),
            studyRoomID: generateString(10)
        })
            .expect(400)
            .then((res) => {
                assert.deepEqual(res.body, { "errors": ["Student does not exist", "StudyRoom does not exist"] })
            })
    });

    //deleting a studyRoom

    let room2 = createRoom(user2.email)
    let room2ID;
    let room3 = createRoom(user2.email)
    let room3ID;
    it("Create 2 study rooms", async () => {

        await request.post('/room/').send(room2)
            .expect(200)
            .then((res) => {
                assert.ok(res.body.owner.includes(user2.email));
                room2ID = res.body.studyRoomID;
            })

        await request.post('/room/').send(room3)
            .expect(200)
            .then((res) => {
                assert.ok(res.body.owner.includes(user2.email));
                room3ID = res.body.studyRoomID;
            })
        await request.get('/room/' + user2.email)
            .expect(200)
            .then((res) => {
                assert.deepEqual(res.body[1].studyRoomID, room2ID);
                assert.deepEqual(res.body[1].owner, user2.email);
                assert.deepEqual(res.body[2].studyRoomID, room3ID);
            })

    });

    it("Deleting a studyroom", async () => {
        await request.delete('/room/').send({
            studyRoomID: room1ID
        })
            .expect(200)
            .then((res) => {
                assert.ok(res.body.includes('deleted 1 room'))
            })
    });

    it("Verifying students' participating rooms", async () => {
        await request.get('/student/email/' + user1.email)
            .expect(200)
            .then((res) => {
                assert.deepEqual(res.body.studyRooms, []);
            })
        await request.get('/student/email/' + user2.email)
            .expect(200)
            .then((res) => {
                assert.deepEqual(res.body.studyRooms, [room2ID, room3ID]);
            })
    });

    it("Deleting a nonexistent studyroom", async () => {
        await request.delete('/room/').send({
            studyRoomID: generateString(10)
        })
            .expect(400)
            .then((res) => {
                assert.deepEqual(res.body, { 'errors': ['StudyRoom does not exist'] })
            })
    });

    it("Add students to the studyRoom", async () => {

        await request.post('/room/add').send({
            email: user1.email,
            studyRoomID: room2ID
        })
            .expect(200)
            .then((res) => {
                assert.ok(res.body.includes(user1.email))
            })
        await request.post('/room/add').send({
            email: user3.email,
            studyRoomID: room2ID
        })
            .expect(200)
            .then((res) => {
                assert.ok(res.body.includes(user3.email))
            })
        await request.post('/room/add').send({
            email: user4.email,
            studyRoomID: room2ID
        })
            .expect(200)
            .then((res) => {
                assert.ok(res.body.includes(user4.email))
            })

    });

    it("Delete a student that is owner of study rooms", async () => {
        let expected = '1 deleted'
        await request.delete('/student/email/' + user2.email)
            .expect(200)
            .then((res) => {
                assert.ok(res.body.includes(expected))
            })

    });

    it('Verifying deletion of empty studyRoom', async () => {
        await request.get('/room/fetch/' + room3ID)
            .expect(200)
            .then((res) => {
                assert.deepEqual(res.body, null);
            })
    });

    it('Verifying ownership change of non-empty studyroom', async () => {
        await request.get('/room/fetch/' + room2ID)
            .expect(200)
            .then((res) => {
                assert.deepEqual(res.body.owner, user1.email);
            })
    });

})

