const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    program: { type: String },

    // TODO
    // calendar -> id of calendar
    // friendList -> array of ObjectID's of other users
    // chats -> array of chat ID's
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;