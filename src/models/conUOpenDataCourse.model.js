const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const openDataCourseSchema = new Schema({
    ID: {type: String, required: true},
    title: {type: String, required: true},
    subject: {type: String, required: true},
    catalog: {type: String, required: true},
    career: {type: String, required: true},
    classUnit: {type: String, required: true},
    prerequisites: {type: String, required: true},
    crosslisted: {type: String, required: true},
}, {
    timestamps: true,
});

const OpenDataCourse = mongoose.model('OpenDataCourse', openDataCourseSchema);

module.exports = OpenDataCourse;