const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const studentSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    program: { type: String },
    faculty: { type: String },
    privateProfile: { type: Boolean },
    friends:{type: [String]},  //usernames
    friendRequestsSent:{type: [String]},  //usernames
    friendRequestsReceived:{type: [String]},  //usernames
    StudyRooms:{type: [String]}, //sID
    cID: { type: String }

    // TODO
    // calendar -> id of calendar
    // friendList -> array of ObjectID's of other users
    // chats -> array of chat ID's
}, {
    timestamps: true,
});

const student = mongoose.model('Student', studentSchema);

module.exports = student;
