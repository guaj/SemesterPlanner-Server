const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Message = require('./message.model');

const studyRoomSchema = new Schema({
    studyRoomID: { type: String, required: true, unique: true },
    owner: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    avatar: { type: String },
    color: { type: String, required: true },
    participants: { type: [String] },
}, {
    timestamps: true,
});

const StudyRoom = mongoose.model('StudyRoom', studyRoomSchema);

module.exports = StudyRoom;