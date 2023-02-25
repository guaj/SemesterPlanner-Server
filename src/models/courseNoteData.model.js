const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const courseNoteDataSchema = new Schema({
    courseNoteID: { type: String, required: true, unique: true },
    bufferedFile: {type: Buffer, required: true}
}, { timestamps: true })

const CourseNoteData = mongoose.model('CourseNoteData', courseNoteDataSchema);

module.exports = CourseNoteData;