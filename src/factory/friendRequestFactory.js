const FriendRequest = require('../models/friendRequest.model');

function createFriendRequest(data) {
    return new FriendRequest({
        senderEmail: data.senderEmail,
        receiverEmail: data.receiverEmail
    })
}

module.exports = createFriendRequest;