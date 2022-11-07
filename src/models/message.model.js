const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    sID: {type: String, required: true}, //the id of the room it belongs to
    mID: { type: String, required: true, unique: true, sparse: true },
    username: { type: String, required: true},
    content: {type: String, required: true},
    time: {type: Date, required: true}
    
}, {
    timestamps: true,
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;