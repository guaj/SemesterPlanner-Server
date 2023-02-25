const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const courseNotesSchema = new Schema({
    courseNoteID: { type: String, required: true, unique: true },
    studyRoomID: { type: String, required: true },
    email: { type: String, required: true },
    filetype: { type: String, required: true },
    filename: { type: String, required: true },
    filesize: { type: String, required: true },
}, { timestamps: true })

const CourseNotes = mongoose.model('CourseNotes', courseNotesSchema);

module.exports = CourseNotes;