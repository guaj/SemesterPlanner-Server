const { request, assert } = require("./helper/app");
const { createRoom } = require("./helper/room_test_data");
const { createUser } = require('./helper/student_test_data')
const dbHandler = require('./helper/db-handler')
const {Buffer, Blob} = require("buffer");

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

describe("Testing room api file routes", () => {

    let student = createUser();
    let room = createRoom(student.email);
    let roomID;
    let courseNoteID;

    // Pre-test user creation
    it("Create a student", async () => {
        await request.post('/student/add').send(
            student
        )
            .expect(200)
            .then((res) => {
                assert.ok(res.body.includes(student.email))
            })
    });

    it("Create a study room", async () => {
        await request.post('/room/').send(room)
            .expect(200)
            .then((res) => {
                assert.ok(res.body.owner.includes(student.email))
                roomID = res.body.studyRoomID;
            })
    });

    it("Upload a file to the study room", async () => {
        await request.post('/room/file').attach('file', './__test__/helper/file/test_file.txt')
            .field('studyRoomID', roomID)
            .field('email', student.email)
            .expect(201)
            .then((res) => {
                expect(res.body).toEqual('File successfully uploaded')
            })
    });

    it("Fetch file list for the study room", async () => {
        await request.get(`/room/files/${roomID}`)
            .expect(200)
            .then((res) => {
                expect(res.body[0].studyRoomID).toEqual(roomID);
                expect(res.body[0].email).toEqual(student.email);
                expect(res.body[0].filetype).toEqual('text/plain');
                expect(res.body[0].filename).toEqual('test_file.txt');
                expect(res.body[0].filesize).toEqual('0.0537109375');
                courseNoteID = res.body[0].courseNoteID;
            })
    })

    it("Download a file from the study room and check its contents", async () => {
        await request.get(`/room/file/${courseNoteID}`)
            .expect(200)
            .then(async (res) => {
                const bufferedFile = Buffer.from(res.body.bufferedFile.data, "base64");
                const file = new Blob([bufferedFile], {type: res.body.filetype});
                expect(await file.text()).toEqual('This file is a test file to be used with express tests.')
            })
    })

    it("Deleting file from the study room", async () => {
        await request.delete(`/room/file/${courseNoteID}`)
            .expect(200)
            .then((res) => {
                expect(res.body).toEqual('deleted 1 file');
            })
    })

    it("Fetch file list for the study room", async () => {
        await request.get(`/room/files/${roomID}`)
            .expect(200)
            .then((res) => {
                expect(res.body).toEqual([]);
            })
    })

})

