const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    studyRoomID: { type: String, required: true }, //the id of the room it belongs to
    messageID: { type: String, required: true, unique: true, sparse: true },
    username: { type: String, required: true },
    content: { type: String, required: true },

}, {
    timestamps: true,
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;