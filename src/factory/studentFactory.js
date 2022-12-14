const Student = require('../models/student.model');
const bcrypt = require('bcrypt');

async function createStudent(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const username = data.username;
    const email = data.email;
    const password = hashedPassword;
    const program = data.program;
    const faculty = data.faculty;
    const privateProfile = data.privateProfile;
    const friends = data.friends;

    return new Student({
        username,
        email,
        password,
        program,
        faculty,
        privateProfile,
        friends
    })
}

module.exports = { createStudent };