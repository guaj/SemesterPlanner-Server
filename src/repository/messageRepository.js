const Message = require('../models/message.model');
const createMessage = require("../factory/messageFactory");

module.exports = class MessageRepository {

    /**
     * Create a message
     * @param {*} data The body/params of the request. It should contain: email, content and studyRoomID.
     * @returns {Student} Returns a promise. Resolves with the message.
     */
    static create(data) {
        return new Promise((resolve, reject) => {
            const newMessage = createMessage(data)
            newMessage.save((err, message) => {
                if (err) { reject(err); }
                resolve(message);
            })
        })
    }

    /**
     * Find one message by its messageID.
     * @param {string} messageID The messageID of the message.
     * @returns {Message} Returns a promise. Resolves with a message.
     */
    static findOne(messageID) {
        return new Promise((resolve, reject) => {
            Event.find({ messageID: messageID.toString() })
                .then((message) => {
                    resolve(message);
                })
                .catch(err => reject(err))
        })
    }

    /**
     * Find a number of most recent messages in room.
     * @param {string} studyRoomID The studyRoomID from which to retrieve messages.
     * @param {number} amount The amount of messages to retrieve.
     * @returns {Message} Returns a promise. Resolves with an array of messages.
     */
    static findMostRecent(studyRoomID, amount) {
        return new Promise((resolve, reject) => {
            Message.find({ studyRoomID: studyRoomID }).sort({ _id: -1 }).limit(amount)
                .then((messages) => {
                    resolve(messages);
                })
                .catch(err => reject(err))
        })
    }
}