// INCOMPLETE
const { request, assert, generateString } = require("./helper/app");
const { createUser } = require('./helper/student_test_data')
const dbHandler = require('./helper/db-handler')

jest.setTimeout(60000);

// Event testing

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => {

    await dbHandler.connect();
    await dbHandler.clearDatabase();
    await dbHandler.refreshDatabase();
});

/**
 * Remove and close the db and server.
 */
afterAll(async () => {
    await dbHandler.closeDatabase();
});

describe("testing event api routes", () => {

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
    let event2;
    it("Create course events", async () => {
        await request.post('/events/add').send(
            {
                username: user1.username,
                eventHeader: 'Soen 490 Captsone Meeting',
                description: generateString(10),
                startDate: new Date(),
                endDate: new Date(),
                startTime: new Date(),
                endTime: new Date(),
                recurrence: 'once',
                type: 'course',
                subject: 'SOEN',
                catalog: '490'

            }
        )
            .expect(200)
            .then((res) => {
                assert.deepEqual(res.body.username, user1.username);
                event2 = res.body;
            })
        await request.post('/events/add').send(
            {
                username: user1.username,
                eventHeader: 'Soen 490 Captsone Meeting 2',
                description: generateString(10),
                startDate: new Date(),
                endDate: new Date(),
                startTime: new Date(),
                endTime: new Date(),
                recurrence: 'once',
                type: 'course',
                subject: 'SOEN',
                catalog: '490'

            }
        )
            .expect(200)
            .then((res) => {
                assert.deepEqual(res.body.username, user1.username);
            })
        await request.post('/events/add').send(
            {
                username: user1.username,
                eventHeader: 'Soen 321 meeting',
                description: generateString(10),
                startDate: new Date(),
                endDate: new Date(),
                startTime: new Date(),
                endTime: new Date(),
                recurrence: 'once',
                type: 'course',
                subject: 'SOEN',
                catalog: '321'

            }
        )
            .expect(200)
            .then((res) => {
                assert.deepEqual(res.body.username, user1.username);
            })
    });

    it("get event", async () => {

        await request.get('/events/event/' + event2.eventID)
            .expect(200)
            .then((res) => {
                assert.deepEqual(res.body, event2)
            })
    });

    it("check student courses", async () => {

        await request.get('/student/email/' + user1.email)
            .expect(200)
            .then((res) => {
                assert.deepEqual(res.body.courses,
                    [
                        { "catalog": "490", "classUnit": "4.00", "studyHours": "6", "subject": "SOEN", "title": "Capstone Software Engineering Design Project" },
                        { "catalog": "321", "classUnit": "3.00", "studyHours": "4.5", "subject": "SOEN", "title": "Information Systems Security" }
                    ]
                )
            })
    });

    it("Create non existent course event", async () => {
        let title = 'Soen 490 Captsone Meeting';
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
                recurrence: 'once',
                type: 'course',
                subject: 'SOEN',
                catalog: '590'

            }
        )
            .expect(400)
            .then((res) => {
                assert.deepEqual(res.body, { "errors": ["Invalid course code or number"] });
            })
    })

    it("get student study hours", async () => {

        await request.get('/student/studyhours/' + user1.email)
            .expect(200)
            .then((res) => {
                assert.deepEqual(res.body, { "studyHours": 10.5 })
            })
    });

    it("get course study hours", async () => {

        await request.get('/opendata/course/studyhours/SOEN/490')
            .expect(200)
            .then((res) => {
                assert.deepEqual(res.body, { "studyHours": 6 })
            })
    });
})

