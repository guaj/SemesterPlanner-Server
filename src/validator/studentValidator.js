const Student = require('../models/student.model');

module.exports = class StudentValidator {

    /**
     * 
     * @param {*} data Student creation data. Should contain: It should contain: username, email, password, program (optional), faculty (optional) and privateProfile.
     */
    static validateCreateData(data) {
        return new Promise((resolve, reject) => {
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
                res.errors.push('Invalid parameter for privateProfile (should be a boolean)')
            }

            if (data.username && data.email) {
                Student.findOne({ username: data.username }).then(student => {
                    if (student != null) {
                        res.errors.push('Username already exists')
                    }
                    Student.findOne({ email: data.email }).then(student => {
                        if (student != null) {
                            res.errors.push('Email already exists')
                        }
                        resolve(res)

                    })
                })
            }
            else { resolve(res) }
            // TO DO: validate program and faculty
        })


    }

}