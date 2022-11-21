const {createOpenDataFaculty} = require("../factory/conUOpenDataFacultyFactory");
const OpenDataFaculty = require('../models/conUOpenDataFaculty.model');

module.exports = class openDataFacultyRepository {
    /**
     * Create a studyRoom.
     * @param {*} data The body/params of the request. It should contain: owner (email), color, participant, title, description (optional), avatarText (optional).
     * @returns {StudyRoom} Returns a promise. Resolves with the studyRoom.
     */
    static create(data) {
        return new Promise((resolve, reject) => {
            const newOpenDataFaculty = createOpenDataFaculty(data)
            newOpenDataFaculty.save((err, faculty) => {
                if (err) {
                    reject(err);
                }
                resolve(faculty);
            })
        })
    }

    // /**
    //  * Find one event by its studyRoomID.
    //  * @param {string} studyRoomID The eventID of the event.
    //  * @returns {StudyRoom} Returns a promise. Resolves with a studyRoom.
    //  */
    // static findOne(studyRoomID) {
    //     return new Promise((resolve, reject) => {
    //         StudyRoom.findOne({ studyRoomID: studyRoomID.toString() }).then((room) => {
    //             resolve(room);
    //         })
    //             .catch(err => reject(err))
    //     })
    // }
    //
    // /**
    //  * Delete one studyRoom by its studyRoomID.
    //  * @param {string} studyRoomID The studyRoomID of the event.
    //  * @returns {number} Returns a promise. Resolves with the number of studyRooms deleted (1 or 0).
    //  */
    // static deleteOne(studyRoomID) {
    //     return new Promise((resolve, reject) => {
    //         StudyRoom.deleteOne({ studyRoomID: studyRoomID.toString() })
    //             .then((status) => {
    //                 resolve(status.deletedCount);
    //             })
    //             .catch(err => reject(err))
    //     })
    // }
    //
    // /**
    //  * Update a studyRoom by saving it to the database.
    //  * @param {*} studyRoom An updated studyRoom object.
    //  * @returns {StudyRoom}  Returns a promise. Resolves with the updated studyRoom.
    //  */
    // static updateOne(studyRoom) {
    //     return new Promise((resolve, reject) => {
    //         studyRoom.save((err, room) => {
    //             if (err) { reject(err); }
    //             resolve(room);
    //         })
    //     })
    // }
    //
    // /**
    //  * Update a studyRoom's participants
    //  * @param {string} email The studyRoomID of the studyRoom.
    //  * @param {[string]} participants An array of participant emails.
    //  * @returns {StudyRoom}  Returns a promise. Resolves with the updated studyRoom.
    //  */
    // static updateParticipants(studyRoomID, participants) {
    //     return new Promise((resolve, reject) => {
    //         StudyRoom.updateOne(
    //             { studyRoomID: studyRoomID },
    //             { participants: participants })
    //             .then((room) => { resolve(room); })
    //             .catch(err => reject(err))
    //     })
    // }
    //
    /**
     * Find all studyRooms of student.
     * @param {string} email The username of the student.
     * @returns {[StudyRoom]} Returns a promise. Resolves with an array of stutyRooms the student is a part of.
     */
    static findAllByFacultyCode(facultyCode) {
        return new Promise((resolve, reject) => {
            OpenDataFaculty.find({
                facultyCode: {"$in": [facultyCode.toUpperCase()]}
            })
                .then((rooms) => {
                    resolve(rooms);
                })
                .catch(err => reject(err))
        })
    }

    static dropTable() {
        return new Promise((resolve, reject) => {
            OpenDataFaculty.collection.drop().then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            })
        })
    }

    static batchCreateFaculty(facultiesData) {
        return new Promise((resolve, reject) => {
            OpenDataFaculty.collection.insertMany(facultiesData, (err, docs) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(docs);
                }
            })
        })
    }
}