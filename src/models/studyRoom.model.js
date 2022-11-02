const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const studyRoomSchema = new Schema({
    sID: { type: String, required: true, unique: true },
    owner: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    avatar: { type: String, required: true },
    color: { type: String, required: true },
    
    paticipants:{type: [String]},
    messages:[{
        mID:{ type: String, required: true, unique: true, sparse: true },
        username: String,
        content: String,
       },{timestamps: true}],

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