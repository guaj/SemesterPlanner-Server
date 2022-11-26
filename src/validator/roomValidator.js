const StudyRoom = require('../models/studyRoom.model');
const Student = require('../models/student.model')

module.exports = class RoomValidator {

    /**
     * Regex hex color validator
     * @param {*} color the color in hex (#FFFFFF)
     * @returns true/false
     */
    static validateColor = (color) => {
        return String(color)
            .match(
                /^#(?:[0-9a-fA-F]{3}){1,2}$/ig
            );
    };

    /**
     * Validator for studyRoom creation.
     * @param {*} studyroom StudyRoom created object. It should contain: owner, title, description.
     * @returns {[string]} Returns a promise. Resolves with nothing, rejects with array of errors.
     */
    static validateStudyRoom(studyroom) {
        return new Promise(async (resolve, reject) => {
            let res = { 'errors': [] };
            if (studyroom.owner == undefined || studyroom.owner == "") {
                res.errors.push('Missing owner');
            }
            else {
                let owner = await Student.findOne({ email: studyroom.owner })
                if (!owner) {
                    res.errors.push('Owner does not exist');
                }
            }
            if (studyroom.title.length > 128) {
                res.errors.push('Room title length exceeds 128 characters');
            }
            if (studyroom.description.length > 2048) {
                res.errors.push('Room description length exceeds 2048 characters');
            }
            if (!this.validateColor(studyroom.color)) {
                res.errors.push('Invalid hex color');
            }

            if (res.errors[0]) {
                reject(res);
            }
            resolve();
        })
    }

    /**
     * Validator for room update.
     * @param {*} studyroom Updated studyroom object.
     * @returns {[string]} Returns a promise. Resolves with nothing, rejects with array of errors.
     */
    static validateUpdateData(studyroom) {
        return new Promise(async (resolve, reject) => {
            let res = { 'errors': [] };
            if (studyroom.owner == undefined || studyroom.owner == "") {
                res.errors.push('Invalid new room owner');
            }
            else {
                if (!studyroom.participants.includes(studyroom.owner)) {
                    res.errors.push('Room owner is not part of the room');
                }
            }
            if (studyroom.title.length > 128) {
                res.errors.push('Room title length exceeds 128 characters');
            }
            if (studyroom.description.length > 1024) {
                res.errors.push('Room description length exceeds 1024 characters');
            }
            if (!this.validateColor(studyroom.color)) {
                res.errors.push('Invalid hex color');
            }
            if (studyroom.participants.length <= 0) {
                res.errors.push('Room cannot have fewer than 1 participants');
            }
            if (res.errors[0]) {
                reject(res);
            }
            resolve();
        })
    }

}