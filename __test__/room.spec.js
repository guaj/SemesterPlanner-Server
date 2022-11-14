// INCOMPLETE
const { request, assert } = require("./helper/app");
const { roomdata } = require("./helper/room_test_data");

const dbHandler = require('./helper/db-handler')

//These tests will work locally, but not in CicleCI because we do not have a public API available.
//Change the URL when that is setup.
jest.useRealTimers();
const random0 = (Math.random() + 8).toString(36).substring(2);
const random2 = (Math.random() + 7).toString(36).substring(2);
const random3 = (Math.random() + 6).toString(36).substring(2);
const random4 = (Math.random() + 4).toString(36).substring(2);

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

