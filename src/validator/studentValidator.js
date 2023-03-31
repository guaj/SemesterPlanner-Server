const Student = require('../models/student.model');

module.exports = class StudentValidator {

    /**
     * Validator for student creation.
     * @param {*} data Student creation data. It should contain: username, email, password, program (optional), faculty (optional) and privateProfile.
     * @returns {[string]} Returns a promise. Resolves with nothing, rejects with array of errors.
     */
    static async validateCreateData(data) {
        let res = {'errors': []};
        if (data.username === undefined || data.username === "") {
            res.errors.push('Missing username');
        }
        if (data.email === undefined || data.email === "") {
            res.errors.push('Missing email');
        }
        if (data.password === undefined || data.password === "") {
            res.errors.push('Missing password');
        }

        if (data.privateProfile !== true && data.privateProfile !== false) {
            res.errors.push('Invalid parameter for privateProfile (should be true or false)');
        }

        if (data.username && data.email) {
            let student = await Student.findOne({username: data.username.toString()})
            if (student != null) {
                res.errors.push('Username already exists');
            }
            student = await Student.findOne({email: data.email.toString()})
            if (student != null) {
                res.errors.push('Email already exists');
            }
        }
        if (res.errors[0]) {
            throw res;
        }
    }

    /**
     * Validator for student update.
     * @param {*} student Updated Student object.
     * @returns {[string]} Returns a promise. Resolves with nothing, rejects with array of errors.
     */
    static async validateUpdateData(student) {
            let res = {'errors': []};
            if (student.privateProfile !== true && student.privateProfile !== false) {
                res.errors.push('Invalid parameter for privateProfile (should be true or false)')
            }
            if (res.errors[0]) {
                throw res;
            }
    }

    /**
     * Validator for deleting student.
     * @param {string} email The student's email.
     * @returns {[string]} Returns a promise. Resolves with nothing, rejects with array of errors.
     */
    static async validateDelete(email) {
            let student = undefined;
            let res = {'errors': []};
            if (email === undefined || email === "") {
                res.errors.push('Invalid email');
            } else {
                student = await Student.findOne({email: email.toString()})
                if (!student) {
                    res.errors.push('Student does not exist');
                }
            }
            if (res.errors[0]) {
                throw res;
            }
    }
}