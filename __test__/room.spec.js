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

    let user1 = createUser();
    let user2 = createUser();
    let user3 = createUser();
    let user4 = createUser();

    it("create 4 students", async () => {

        let expected = user1.username

        await request.post('/student/add').send(
            user1
        )
            .expect(200)
            .expect((res) => {
                assert.ok(res.text.includes(expected))
            })
        await request.post('/student/add').send(
            user2
        )
            .expect(200)
            .expect((res) => {
                assert.ok(res.text.includes(expected))
            })
        await request.post('/student/add').send(
            user3
        )
            .expect(200)
            .expect((res) => {
                assert.ok(res.text.includes(expected))
            })
        await request.post('/student/add').send(
            user4
        )
            .expect(200)
            .expect((res) => {
                assert.ok(res.text.includes(expected))
            })
    });

    let room1 = createRoom(user1.email)
    var room1ID;

    it("create a study room", async () => {

        await request.post('/room/').send(room1)
            .expect(200)
            .expect((res) => {
                console.log(res.text)
                assert.ok(res.text.includes('created'))
            })

    });

    it("Get room by email", async () => {

        await request.get('/room/' + user1.email)
            .expect(200)
            .expect((res) => {
                assert.ok(res.text.includes(room1.owner));
                room1ID = JSON.parse(res.text)[0].studyRoomID;
            })
    });

    it("get room by studyRoomID", async () => {

        await request.get('/room/fetch/' + room1ID)
            .expect(200)
            .expect((res) => {
                assert.ok(res.text.includes(room1ID));
            })
    });
    /// delete a study room

})

