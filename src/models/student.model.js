const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const studentSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    program: { type: String },
    faculty: { type: String },
    privateProfile: { type: Boolean },
    friends: { type: [String] },  //email
    studyRooms: { type: [String] }, //studyRoomID
    calendarID: { type: String },
    courses: { type: [Object] }

}, {
    timestamps: true,
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
