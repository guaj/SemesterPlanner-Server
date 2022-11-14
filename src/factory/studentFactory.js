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

async function editStudent(data) {
    var student = {};
    if(req.body.password){
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
    }
    if (data.username) {
        user.username = data.username;
    }
    if (data.email) {
        user.email = data.email;
    }
    if (data.password) {
        user.password = hashedPassword;
    }
    if (data.program) {
        user.program = data.program;
    }
    if (data.faculty) {
        user.faculty = data.faculty;
    }
    if (data.privateProfile) {
        user.privateProfile= data.privateProfile;
    }
    return student;
}

module.exports = {createStudent, editStudent};