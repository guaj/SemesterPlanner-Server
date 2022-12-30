const CourseNotes = require('../models/courseNotes.model');
const {v4: uuidv4} = require('uuid');
const fs = require('fs');


function createCourseNotes(data) {
    const courseNoteID = uuidv4();
    let filedata;

    try {
        filedata = fs.readFileSync(data.file.path);
    } catch (e) {
        console.log(e);
    } finally {
        fs.unlink(data.file.path, (err) => {
            if (err)
                console.log(err);
        });
    }

    return new CourseNotes({
        courseNoteID: courseNoteID,
        studyRoomID: data.studyRoomID,
        email: data.email,
        filetype: data.file.mimetype,
        filename: data.file.originalname,
        filesize: data.file.size / 1024,
        bufferedFile: filedata
    })
}

module.exports = createCourseNotes;