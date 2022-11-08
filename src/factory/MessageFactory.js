const Message = require('../models/message.model');
const { v4: uuidv4 } = require('uuid');

function CreateMessage(data) {

    console.log(data);
    const messageId = uuidv4();
    console.log(messageId);
    return new Message({
        sID: data.sID,
        mID: messageId,
        username: data.username,
        content: data.content,
        time: new Date()
    })
}

module.exports = CreateMessage;