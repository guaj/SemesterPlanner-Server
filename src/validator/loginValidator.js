const Student = require('../models/student.model');

module.exports = class LoginValidator {

    /**
     * Validator for student creation.
     * @param {*} data Student creation data. It should contain: username, email, password, program (optional), faculty (optional) and privateProfile.
     * @returns {[string]} Returns a promise. Resolves with nothing, rejects with array of errors.
     */
    static validateLogin(data) {
        return new Promise(async (resolve, reject) => {
            let res = { 'errors': [] };
            if (data.email == undefined || data.email == "") {
                res.errors.push('Missing email');
            }
            if (data.password == undefined || data.password == "") {
                res.errors.push('Missing password');
            }
            if (res.errors[0]) {
                reject(res);
            }
            resolve();
        })


    }

}