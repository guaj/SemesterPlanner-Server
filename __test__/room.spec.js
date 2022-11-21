// INCOMPLETE
const { request, assert } = require("./helper/app");
const { roomdata } = require("./helper/room_test_data");
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

    //creating a study room
    it("create a study room", async () => {

        await request.post('/room/').send(roomdata)
            .expect(200)

    });

    it("fetching data from study room by sID", async () => {

        await request.get('/room/fetch/r9q1yfw32ro')
            .expect(200)

    });
    /// delete a study room

})

