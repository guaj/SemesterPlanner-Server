const Student = require('../models/student.model');
const { createStudent } = require("../factory/studentFactory");

module.exports = class StudentRepository {

    /**
     * Create student.
     * @param {*} data The body/params of the request. It should contain: username, email, password, program (optional), faculty (optional) and privateProfile (optional).
     * @returns {Student} Returns a promise. Resolves with the student.
     */
    static create(data) {
        return new Promise((resolve, reject) => {
            createStudent(data).then((newStudent) => {
                newStudent.save((err, student) => {
                    if (err) { reject(err); }
                    resolve(student);
                })
            })
        })
    }

    /**
     * Find all students.
     * @returns {[Student]} Returns a promise. Resolves with an array of all students.
     */
    static findAll() {
        return new Promise((resolve, reject) => {
            Student.find().then((students) => {
                resolve(students);
            })
                .catch(err => reject(err))
        })
    }

    /**
     * Find a student by email.
     * @param {string} email The email of the student.
     * @returns {Student} Returns a promise. Resolves with one student, or null.
     */
    static findOneByEmail(email) {
        return new Promise((resolve, reject) => {
            Student.findOne({ email: email.toString() })
                .then((student) => {
                    resolve(student);
                })
                .catch(err => reject(err))
        })
    }

    /**
     * Find a student by username.
     * @param {String} username The username of the student
     * @returns {Student} Returns a promise. Resolves with one student, or null.
     */
    static findOneByUsername(username) {
        return new Promise((resolve, reject) => {
            Student.findOne({ username: username.toString() })
                .then((student) => {
                    resolve(student);
                })
                .catch(err => reject(err))
        })
    }

    /**
     * Find a student by MongoDB _id.
     * @param {*} _id The _id of the student.
     * @returns {Student} Returns a promise. Resolves with one student, or null.
     */
    static findOneByID(_id) {
        return new Promise((resolve, reject) => {
            Student.findById(id)
                .then((student) => {
                    resolve(student);
                })
                .catch(err => reject(err))
        })
    }

    /**
     * Delete a student by ID, email or username.
     * @param {*} data The body/params of the request. It should contain: username, email or mongo interal ID.
     * @returns Returns a promise. Resolves with the deletion count. (Either 1 or 0)
     */
    static deleteOne(data) {
        return new Promise((resolve, reject) => {
            if (data.email) {
                Student.deleteOne({ email: data.email.toString() })
                    .then((status, err) => {
                        if (err) { reject(err); }
                        resolve(status.deletedCount);
                    })
            }
            else if (data.username) {
                Student.deleteOne({ username: data.username.toString() })
                    .then((status, err) => {
                        if (err) { reject(err); }
                        resolve(status.deletedCount);
                    })
            }
            else if (data.id) {
                Student.findByIdAndDelete(data.id)
                    .then((status, err) => {
                        if (err) { reject(err); }
                        resolve(status.deletedCount);
                    })
            }
            else { reject(new Error('No valid parameters given.')); }

        })
    }

    /**
     * Update a student by saving it to the database.
     * @param {*} student An updated student object.
     * @returns Returns a promise. Resolves with the updated student.
     */
    static save(student) {
        return new Promise((resolve, reject) => {
            student.save((err, student) => {
                if (err) { reject(err); }
                resolve(student);
            })
        })
    }

    /**
     * Update a student's sent friend requests.
     * @param {string} username The username of the student.
     * @param {[string]} friendRequestsSent The array of usernames who have been sent a friend request.
     * @returns Returns a promise. Resolves with the updated student.
     */
    static updateFriendRequestSent(username, friendRequestsSent) {
        Student.updateOne(
            { username: username },
            { friendRequestsSent: friendRequestsSent },
            (err, docs) => {
                if (err) { reject(err); }
                resolve(docs)
            },
        );
    }

    /**
     * Update a student's received friend requests'.
     * @param {string} username The username of the student.
     * @param {[string]} friendRequestsReceived The array of usernames who have sent a friend request.
     * @returns Returns a promise. Resolves with the updated student.
     */
    static updateFriendRequestReceived(username, friendRequestsReceived) {
        Student.updateOne(
            { username: username },
            { friendRequestsReceived: friendRequestsReceived },
            (err, docs) => {
                if (err) { reject(err); }
                resolve(docs)
            },
        );
    }

    /**
     * Update a student's studyRooms
     * @param {string} email The studyRoomID of the studyRoom.
     * @param {[string]} studyRooms An array of participant emails.
     * @returns {Student}  Returns a promise. Resolves with the updated student.
     */
    static updateStudyRooms(email, studyRooms) {
        return new Promise((resolve, reject) => {
            Student.updateOne(
                { email: email },
                { studyRooms: studyRooms })
                .then((student) => { resolve(student); })
                .catch(err => reject(err))
        })
    }

}