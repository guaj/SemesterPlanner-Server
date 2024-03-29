const StudyRoom = require('../models/studyRoom.model');
const { v4: uuidv4 } = require('uuid');

function createStudyRoom(data) {
    const studyRoomID = uuidv4();
    const owner = data.owner;
    let color = '#912338';
    if (data.color) {
        color = data.color;
    }
    let description = "A study room."; // default description
    if (data.description) {
        description = data.description;
    }
    let title = 'Unnamed Room'; // default room name
    if (data.title) {
        title = data.title;
    }
    const avatar = data.avatarText;
    let participants = data.participants;
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