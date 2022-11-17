const CourseNotes = require('../models/courseNotes.model');
const createCourseNotes = require("../factory/courseNotesFactory");

module.exports = class CourseNotesRepository {

    /**
     * Create an event.
     * @param {*} data The body/params of the request. It should contain: studyRoomID, email, type, name, size, file, type}
     * @returns {CourseNotes} Returns a promise. Resolves with the courseNotes.
     */
    static create(data) {
        return new Promise((resolve, reject) => {
            const newCourseNotes = createCourseNotes(data)
            newCourseNotes.save((err, event) => {
                if (err) { reject(err); }
                resolve(event);
            })
        })
    }

    /**
     * Find all courseNotes in studyRoom.
     * @param {string} studyRoomID The studyRoomID of the room.
     * @returns {[CourseNotes]} Returns a promise. Resolves with an array of courseNotes belonging to the studyRoom.
     */
    static findAllbyStudyRoomID(studyRoomID) {
        return new Promise((resolve, reject) => {
            CourseNotes.find({ studyRoomID: studyRoomID.toString() }).then((courseNotes) => {
                resolve(courseNotes);
            })
                .catch(err => reject(err))
        })
    }

    /**
     * Find one courseNotes by its courseNotesID.
     * @param {*} courseNotesID The courseNotesID of the courseNotes.
     * @returns {CourseNotes} Returns a promise. Resolves with a courseNotes.
     */
    static findOne(courseNotesID) {
        return new Promise((resolve, reject) => {
            CourseNotes.find({ courseNotesID: courseNotesID.toString() }).then((courseNotes) => {
                resolve(courseNotes);
            })
                .catch(err => reject(err))
        })
    }

    /**
     * Delete one courseNotes by its courseNotesID.
     * @param {string} courseNotesID The courseNotesID of the courseNotes.
     * @returns {number} Returns a promise. Resolves with the number of courseNotes deleted (1 or 0).
     */
    static deleteOne(courseNotesID) {
        return new Promise((resolve, reject) => {
            CourseNotes.deleteOne({ courseNotesID: courseNotesID.toString() })
                .then((status) => {
                    resolve(status.deletedCount);
                })
                .catch(err => reject(err))
        })
    }
}