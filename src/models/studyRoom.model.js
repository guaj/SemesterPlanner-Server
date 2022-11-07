const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Message = require('./message.model');

const studyRoomSchema = new Schema({
    sID: { type: String, required: true, unique: true },
    owner: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    avatar: { type: String, required: true },
    color: { type: String, required: true },
    
    participants:{type: [String]},
    messages:[Message.schema],

    courseNotes:[{
        cnID:{ type: String, required: true, unique: true, sparse: true},
        username: String,
        type:String,
        file: Buffer,
        },{timestamps: true}]
    
}, {
    timestamps: true,
});

const StudyRoom = mongoose.model('StudyRoom', studyRoomSchema);

module.exports = StudyRoom;