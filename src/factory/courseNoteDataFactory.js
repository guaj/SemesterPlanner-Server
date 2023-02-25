const CourseNoteData = require('../models/courseNoteData.model');

function createCourseNoteData(courseNoteID, fileDataBuffer) {
    return new CourseNoteData({
        courseNoteID: courseNoteID,
        bufferedFile: fileDataBuffer
    })
}

module.exports = createCourseNoteData;