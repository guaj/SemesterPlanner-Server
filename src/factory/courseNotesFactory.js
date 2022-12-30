const CourseNotes = require('../models/courseNotes.model');
const {v4: uuidv4} = require('uuid');

function createCourseNotes(data) {
    const courseNoteID = uuidv4();

    return new CourseNotes({
        courseNoteID: courseNoteID,
        studyRoomID: data.studyRoomID,
        email: data.email,
        filetype: data.file.mimetype,
        filename: data.file.originalname,
        filesize: data.file.size / 1024,
        bufferedFile: data.bufferedFile
    })
}

module.exports = createCourseNotes;