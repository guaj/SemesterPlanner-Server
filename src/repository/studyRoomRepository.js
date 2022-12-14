const { createStudyRoom } = require("../factory/roomFactory");
const StudyRoom = require('../models/studyRoom.model');
const StudyRoomValidator = require('../validator/roomValidator')

module.exports = class studyRoomRepository {
    /**
     * Create a studyRoom.
     * @param {*} data The body/params of the request. It should contain: owner (email), color, participant, title, description (optional), avatarText (optional).
     * @returns {StudyRoom} Returns a promise. Resolves with the studyRoom.
     */
    static create(data) {
        return new Promise((resolve, reject) => {
            const newRoom = createStudyRoom(data)
            StudyRoomValidator.validateStudyRoom(newRoom).then(() => {
                newRoom.save((err, room) => {
                    if (err) { reject(err); }
                    resolve(room);
                })
            })
                .catch((errs) => reject(errs))
        })
    }

    /**
     * Find one event by its studyRoomID.
     * @param {string} studyRoomID The eventID of the event.
     * @returns {StudyRoom} Returns a promise. Resolves with a studyRoom.
     */
    static findOne(studyRoomID) {
        return new Promise((resolve, reject) => {
            StudyRoom.findOne({ studyRoomID: studyRoomID.toString() }).then((room) => {
                resolve(room);
            })
                .catch(err => reject(err))
        })
    }

    /**
     * Delete one studyRoom by its studyRoomID.
     * @param {string} studyRoomID The studyRoomID of the event.
     * @returns {number} Returns a promise. Resolves with the number of studyRooms deleted (1 or 0).
     */
    static deleteOne(studyRoomID) {
        return new Promise((resolve, reject) => {
            StudyRoom.deleteOne({ studyRoomID: studyRoomID.toString() })
                .then((status) => {
                    resolve(status.deletedCount);
                })
                .catch(err => reject(err))
        })
    }

    /**
     * Update a studyRoom by saving it to the database.
     * @param {*} studyRoom An updated studyRoom object.
     * @returns {StudyRoom}  Returns a promise. Resolves with the updated studyRoom.
     */
    static updateOne(studyRoom) {
        return new Promise((resolve, reject) => {
            StudyRoomValidator.validateUpdateData(studyRoom).then(() => {
                studyRoom.save((err, room) => {
                    if (err) { reject(err); }
                    resolve(room);
                })
            })
                .catch((errs) => reject(errs))
        })
    }

    /**
     * Update a studyRoom's participants
     * @param {string} email The studyRoomID of the studyRoom.
     * @param {[string]} participants An array of participant emails.
     * @returns {StudyRoom}  Returns a promise. Resolves with the updated studyRoom.
     */
    static updateParticipants(studyRoomID, participants) {
        return new Promise((resolve, reject) => {
            StudyRoom.updateOne(
                { studyRoomID: studyRoomID },
                { participants: participants })
                .then((room) => { resolve(room); })
                .catch(err => reject(err))
        })
    }

    /**
     * Find all studyRooms of student.
     * @param {string} email The username of the student.
     * @returns {[StudyRoom]} Returns a promise. Resolves with an array of stutyRooms the student is a part of.
     */
    static findAllbyStudentEmail(email) {
        return new Promise((resolve, reject) => {
            StudyRoom.find({
                participants: { "$in": [email] }
            })
                .then((rooms) => {
                    resolve(rooms);
                })
                .catch(err => reject(err))
        })
    }
}