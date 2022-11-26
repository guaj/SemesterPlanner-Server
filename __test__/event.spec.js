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

describe("testing event api routes", () => {

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

    // Pre-test setups creation
    it("Create student", async () => {

        await request.post('/student/add').send(
            user1
        )
            .expect(200)
            .then((res) => {
                assert.ok(res.body.includes(user1.email))
            })
    });

    //Event creation
    let event1;
    it("Create event", async () => {
        let title = generateString(10);
        let desc = generateString(10);
        await request.post('/events/add').send(
            {
                username: user1.username,
                eventHeader: title,
                description: desc,
                startDate: new Date(),
                endDate: new Date(),
                startTime: new Date(),
                endTime: new Date(),
                recurrence: 'once'

            }
        )
            .expect(200)
            .then((res) => {
                assert.deepEqual(res.body.username, user1.username);
                event1 = res.body;
            })
    });

    it("get event", async () => {

        await request.get('/events/event/' + event1.eventID)
            .expect(200)
            .then((res) => {
                assert.deepEqual(res.body, event1)
            })
    });
})

