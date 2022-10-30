const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const studyRoomSchema = new Schema({
    sID: { type: String, required: true, unique: true },
    owner: { type: String, required: true, unique: true },
    paticipants:{type: [String]},
    messages:[{
        mID:{ type: String, required: true, unique: true },
        username: String,
        content: String,
        timestamps:true
        }]
    
}, {
    timestamps: true,
});

const StudyRoom = mongoose.model('StudyRoom', studyRoomSchema);

module.exports = StudyRoom;