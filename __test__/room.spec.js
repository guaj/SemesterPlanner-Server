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

    it("Create a study room", async () => {

        await request.post('/room/').send(room1)
            .expect(200)
            .then((res) => {
                assert.ok(res.body.includes('created'))
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

    it("Add students to the studyRoom", async () => {

        await request.post('/room/add').send({
            email: user2.email,
            studyRoomID: room1ID
        })
            .expect(200)
            .then((res) => {
                console.log(res.body)
                assert.ok(res.body.includes(user2.email))
            })
        await request.post('/room/add').send({
            email: user3.email,
            studyRoomID: room1ID
        })
            .expect(200)
            .then((res) => {
                console.log(res.body)
                assert.ok(res.body.includes(user3.email))
            })
        await request.post('/room/add').send({
            email: user4.email,
            studyRoomID: room1ID
        })
            .expect(200)
            .then((res) => {
                console.log(res.body)
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

    /// delete a study room

})

