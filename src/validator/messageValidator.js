const Student = require('../models/student.model');
const Message = require('../models/message.model');
const StudyRoom = require('../models/studyRoom.model');

module.exports = class MessageValidator {

    /**
     * Validator for student creation.
     * @param {*} data Student creation data. It should contain: username, email, password, program (optional), faculty (optional) and privateProfile.
     * @returns {[string]} Returns a promise. Resolves with nothing, rejects with array of errors.
     */
    static validateCreateData(data) {
        return new Promise(async (resolve, reject) => {
            let student = undefined, room = undefined;
            let res = { 'errors': [] };
            if (data.email == undefined || data.email == "") {
                res.errors.push('Missing email (message author)');
            }
            else {
                student = await Student.findOne({ email: data.email.toString() })
                if (!student) {
                    res.errors.push('Message author does not exist');
                }
            }
            if (data.content == undefined || data.content == "") {
                res.errors.push('Missing message content');
            }
            if (data.content.length > 4096) {
                res.errors.push('Message content exceeds 4096 characters');
            }
            if (data.studyRoomID == undefined || data.studyRoomID == "") {
                res.errors.push('Missing studyRoomID');
            }
            else {
                room = await StudyRoom.findOne({ studyRoomID: data.studyRoomID.toString() })
                if (!room) {
                    res.errors.push('StudyRoom does not exist');
                }
            }

            if (room && student && !room.participants.includes(student.email)) {
                res.errors.push('Message author does not belong to studyRoom');
            }
            if (res.errors[0]) {
                reject(res);
            }
            resolve();
        })
    }

    /**
     * Validator for bulk message retrieval.
     * @param {number} amount Number of messages to retrieve
     * @param {number} ignore Number of messages to ignore (remove from amount)
     * @returns {[string]} Returns a promise. Resolves with nothing, rejects with array of errors.
     */
    static validateBulkRetrieveIgnore(amount, ignore) {
        return new Promise(async (resolve, reject) => {
            let res = { 'errors': [] };
            if (!isNaN(amount)) {
                if (amount == undefined || amount == "") {
                    res.errors.push('Amount is missing');
                }
                if (parseInt(amount) < 1) {
                    res.errors.push('Amount less than 1');
                }
            }
            else {
                res.errors.push('Amount is not a number')
            }
            if (!isNaN(ignore)) {
                if (ignore == undefined || ignore == "") {
                    res.errors.push('Ignore is missing');
                }
                if (parseInt(ignore) < 1) {
                    res.errors.push('Ignore is less than 1');
                }
            }
            else {
                res.errors.push('Ignore is not a number')
            }
            if (res.errors[0]) {
                reject(res);
            }
            resolve();
        })
    }

    /**
     * Validator for bulk message retrieval.
     * @param {number} amount Number of messages to retrieve
     * @returns {[string]} Returns a promise. Resolves with nothing, rejects with array of errors.
     */
    static validateBulkRetrieve(amount) {
        return new Promise(async (resolve, reject) => {
            let res = { 'errors': [] };
            if (!isNaN(amount)) {
                if (amount == undefined || amount == "") {
                    res.errors.push('Amount is missing');
                }
                if (parseInt(amount) < 1) {
                    res.errors.push('Amount less than 1');
                }
            }
            else {
                res.errors.push('Amount is not a number')
            }
            if (res.errors[0]) {
                reject(res);
            }
            resolve();
        })
    }

}