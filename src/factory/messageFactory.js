const Message = require('../models/message.model');
const { v4: uuidv4 } = require('uuid');

function createMessage(data) {
    const messageId = uuidv4();
    return new Message({
        studyRoomID: data.studyRoomID,
        messageID: messageId,
        email: data.email,
        content: data.content,
        time: new Date()
    })
}

module.exports = createMessage;