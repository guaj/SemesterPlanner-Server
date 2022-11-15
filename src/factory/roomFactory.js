const StudyRoom = require('../models/studyRoom.model');

function createStudyRoom(data) {
    const randomID = (Math.random() + 2).toString(36).substring(2);
    const studyRoomID = randomID;
    const owner = data.owner;
    const color = data.color
    const description = data.description
    const title = data.title
    const avatar = data.avatarText
    const participants = data.participants
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

function editStudyRoom(data) {
    let room = {};
    if (data.owner) {
        room.owner = data.owner;
    }
    if (data.color) {
        room.color = data.color;
    }
    if (data.description) {
        room.description = data.description;
    }
    if (data.title) {
        room.title = data.title;
    }
    if (data.avatarText) {
        room.avatar = data.avatarText;
    }
    if (data.participants) {
        room.participants = data.participants;
    }
    return room;
}

module.exports = { createStudyRoom, editStudyRoom };