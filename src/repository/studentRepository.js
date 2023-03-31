const Student = require('../models/student.model');
const { createStudent } = require("../factory/studentFactory");
const StudentValidator = require('../validator/studentValidator')

module.exports = class StudentRepository {

    /**
     * Create student.
     * @param {*} data The body/params of the request. It should contain: username, email, password, program (optional), faculty (optional) and privateProfile (optional).
     * @returns {Student} Returns a promise. Resolves with the student.
     */
    static create(data) {
        return new Promise((resolve, reject) => {
            StudentValidator.validateCreateData(data).then(() => {
                createStudent(data).then((newStudent) => {
                    newStudent.save((err, student) => {
                        if (err) { reject(err); }
                        resolve(student);
                    })
                })
            })
                .catch(errs => reject(errs))
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
     * @param {Student} student An updated student object.
     * @returns Returns a promise. Resolves with the updated student.
     */
    static async updateOne(student) {
        return await new Promise((resolve, reject) => {
            StudentValidator.validateUpdateData(student)
                .then(() => {
                    student.save((err, student) => {
                        if (err) { reject(err); }
                        resolve(student);
                    })
                })
                .catch(errs => reject(errs))

        })
    }

    /**
     * Update a student's friend list
     * @param {string} email The email of the student to update
     * @param {[string]} updatedFriendList The updated friend list
     * @returns {Student} Returns a promise. Resolves with the updated student.
     */
    static async updateFriendList(email, updatedFriendList) {
        return await new Promise((resolve, reject) => {
            Student.updateOne({ email: email.toString() }, {
                friends: updatedFriendList
            }).then((student) => { resolve(student) })
                .catch((err) => reject(err))
        })
    }


    /**
     * Update a student's studyRooms
     * @param {string} email The email of the student.
     * @param {[string]} studyRooms An array of studyroomIDs.
     * @returns {Student}  Returns a promise. Resolves with the updated student.
     */
    static async updateStudyRooms(email, studyRooms) {
        return await new Promise((resolve, reject) => {
            Student.updateOne(
                { email: email.toString() },
                { studyRooms: studyRooms })
                .then((student) => { resolve(student); })
                .catch(err => reject(err))
        })
    }

    /**
     * Update a student's courses
     * @param {string} username The username of the student.
     * @param {[String]} courses An array of course objects.
     * @returns {Student}  Returns a promise. Resolves with the updated student.
     */
    static async updateCourses(username, courses) {
        return await new Promise((resolve, reject) => {
            Student.updateOne(
                { username: username.toString() },
                { courses: courses })
                .then((student) => { resolve(student); })
                .catch(err => reject(err))
        })
    }

    /**
     * Add a student1 to a student2 friend list.
     * @param {string} email1 student email to update
     * @param {string} email2 student email added to friend list
     * @returns {Student} Returns a promise. Resolves with the updated student.
     */
    static async addToFriendList(email1, email2) {
        return await Student.findOne({email: email1})
            .then(async (student) => {
                student.friends.push(email2);
                return await student.save()
                    .then((student) => {
                        return student;
                    })
                    .catch((err) => {
                        throw err;
                    })
            })
            .catch((err) => {
                throw err;
            })
    }

    /**
     * Validate if a student1 is part of student 2 friend list.
     * @param {string} student1 student email to validate
     * @param {string} student2 student email to be checked in the friend list
     * @returns {Boolean} true if student2 is part of student1 friend list, false otherwise
     */
    static async isInFriendList(student1, student2) {
        let res = await Student.findOne({email: student1.toString()});
        return (res != null && res.friends.some((friend) => friend === student2));
    }
}