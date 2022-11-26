const Student = require('../models/student.model');

module.exports = class StudentValidator {

    /**
     * Validator for student creation.
     * @param {*} data Student creation data. It should contain: username, email, password, program (optional), faculty (optional) and privateProfile.
     * @returns {[string]} Returns a promise. Resolves with nothing, rejects with array of errors.
     */
    static validateCreateData(data) {
        return new Promise(async (resolve, reject) => {
            let res = { 'errors': [] };
            if (data.username == undefined || data.username == "") {
                res.errors.push('Missing username');
            }
            if (data.email == undefined || data.email == "") {
                res.errors.push('Missing email');
            }
            if (data.password == undefined || data.password == "") {
                res.errors.push('Missing password');
            }
            if (data.privateProfile != 'true' && data.privateProfile != 'false' && data.privateProfile != undefined) {
                res.errors.push('Invalid parameter for privateProfile (should be true or false)');
            }

            if (data.username && data.email) {
                var student = await Student.findOne({ username: data.username })
                if (student != null) {
                    res.errors.push('Username already exists');
                }
                student = await Student.findOne({ email: data.email })
                if (student != null) {
                    res.errors.push('Email already exists');
                }
            }
            if (res.errors[0]) {
                reject(res);
            }
            resolve();
            // TO DO: validate program and faculty
        })


    }

    /**
     * Validator for student update.
     * @param {*} student Updated Student object.
     * @returns {[string]} Returns a promise. Resolves with nothing, rejects with array of errors.
     */
    static validateUpdateData(student) {
        return new Promise((resolve, reject) => {
            let res = { 'errors': [] };
            if (student.privateProfile != true && student.privateProfile != false && student.privateProfile != undefined && student.privateProfile != '') {
                res.errors.push('Invalid parameter for privateProfile (should be true or false)')
            }

            // TO DO: validate program and faculty

            if (res.errors[0]) {
                reject(res);
            }
            resolve();

        })
    }

}