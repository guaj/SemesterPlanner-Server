const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const friendRequestSchema = new Schema({
    senderEmail: String,
    receiverEmail: String,
}, {
    timestamps: true,
});

const friendRequest = mongoose.model('FriendRequest', friendRequestSchema);

module.exports = friendRequest;