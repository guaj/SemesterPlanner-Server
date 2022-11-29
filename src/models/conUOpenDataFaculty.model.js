const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const openDataFacultySchema = new Schema({
    facultyCode: {type: String, required: true},
    facultyDescription: {type: String, required: true},
    departmentCode: {type: String, required: true},
    departmentDescription: {type: String, required: true},
}, {
    timestamps: true,
});

const OpenDataFaculty = mongoose.model('OpenDataFaculty', openDataFacultySchema);

module.exports = OpenDataFaculty;