const Student = require('../models/student.model');
const { createStudent, editStudent } = require("../factory/studentFactory");

module.exports = class StudentRepository {
    /**
     * Create student.
     * @param {*} data The body/params of the request.
     * @returns {Promise} Returns a promise. Resolves with the student.
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
            Student.find().then((students, err) => {
                if (err) { reject(err); }
                resolve(students);
            })
        })
    }

    /**
     * Find a student by ID, email or username.
     * @param {*} data The body/params of the request.
     * @returns {Student} Returns a promise. Resolves with one student, or null.
     */
    static findOne(data) {
        return new Promise((resolve, reject) => {
            if (data.email) {
                Student.findOne({ email: data.email.toString() })
                    .then((student, err) => {
                        if (err) { reject(err); }
                        resolve(student);
                    })
            }
            else if (data.username) {
                Student.findOne({ username: data.username.toString() })
                    .then((student, err) => {
                        if (err) { reject(err); }
                        resolve(student);
                    })
            }
            else if (data.id) {
                Student.findById(data.id)
                    .then((student, err) => {
                        if (err) { reject(err); }
                        resolve(student);
                    })
            }
            else { reject(new Error('No valid parameters given.')); }

        })
    }

    /**
     * Delete a student by ID, email or username.
     * @param {*} data The body/params of the request.
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
     * Update a student by email
     * @param {*} student A student.
     * @returns Returns a promise. Resolves with the updated student.
     */
    static updateOne(student) {
        return new Promise((resolve, reject) => {
            student.save((err, student) => {
                if (err) { reject(err); }
                resolve(student);
            })
        })
    }
}