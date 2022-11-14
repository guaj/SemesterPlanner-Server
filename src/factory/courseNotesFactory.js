const CourseNotes = require('../models/courseNotes.model');
const { v4: uuidv4 } = require('uuid');

function createCourseNotes(data) {
    const courseNoteID = uuidv4();
    return new CourseNotes({
        courseNoteID: courseNoteID,
        studyRoomID: data.studyRoomID,
        email: data.email,
        filetype: data.type,
        filename: data.name,
        filesize: data.size,
        file: {
            data: data.file,
            contentType: data.type
        }
    })
}

module.exports = createCourseNotes;