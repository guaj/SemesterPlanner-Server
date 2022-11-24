const StudyRoom = require('../models/studyRoom.model');
const { v4: uuidv4 } = require('uuid');

function createStudyRoom(data) {
    const studyRoomID = uuidv4();
    const owner = data.owner;
    const color = data.color;
    const description = data.description;
    const title = data.title;
    const avatar = data.avatarText;
    var participants = [owner];
    return new StudyRoom({
        studyRoomID,
        owner,
        color,
        description,
        title,
        avatar,
        participants
    })
}
module.exports = { createStudyRoom };