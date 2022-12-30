const CourseNotes = require('../models/courseNotes.model');
const createCourseNotes = require("../factory/courseNotesFactory");
const fs = require('fs');
const util = require('util');

// makes the asynchronous fs.readFile(...) method return a promise; the use of asynchronous fs.readFile(...) instead
// of synchronous fs.readFileSync(...) for scalability and performance improvement
const readFile = util.promisify(fs.readFile);

module.exports = class CourseNotesRepository {
    /**
     * Create an event.
     * @param {*} data The body/params of the request. It should contain: studyRoomID, email, type, name, size, file, type}
     * @returns {CourseNotes} Returns a promise. Resolves with the courseNotes.
     */
    static create(data) {
        return readFile(data.file.path).then((bufferedFile) => {
                data.bufferedFile = bufferedFile
                return new Promise((resolve, reject) => {
                    const newCourseNotes = createCourseNotes(data)
                    newCourseNotes.save((err, event) => {
                        if (err) {
                            reject(err);
                        }
                        resolve(event);
                    })
                })
            }
        ).finally(() => {
            fs.unlink(data.file.path, (err) => {
                if (err)
                    console.log(err);
            });
        })
    }

    /**
     * Find all courseNotes in studyRoom.
     * @param {string} studyRoomID The studyRoomID of the room.
     * @returns {[CourseNotes]} Returns a promise. Resolves with an array of courseNotes belonging to the studyRoom.
     */
    static findAllbyStudyRoomID(studyRoomID) {
        return new Promise((resolve, reject) => {
            CourseNotes.find({studyRoomID: studyRoomID.toString()}).then((courseNotes) => {
                resolve(courseNotes);
            })
                .catch(err => reject(err))
        })
    }

    /**
     * Find one courseNotes by its courseNotesID.
     * @param {*} courseNoteID The courseNotesID of the courseNotes.
     * @returns {CourseNotes} Returns a promise. Resolves with a courseNotes.
     */
    static findOne(courseNoteID) {
        return new Promise((resolve, reject) => {
            CourseNotes.findOne({courseNoteID: courseNoteID.toString()}).then((courseNotes) => {
                resolve(courseNotes);
            })
                .catch(err => reject(err))
        })
    }

    /**
     * Delete one courseNotes by its courseNotesID.
     * @param {string} courseNoteID The courseNotesID of the courseNotes.
     * @returns {number} Returns a promise. Resolves with the number of courseNotes deleted (1 or 0).
     */
    static deleteOne(courseNoteID) {
        return new Promise((resolve, reject) => {
            CourseNotes.deleteOne({courseNoteID: courseNoteID.toString()})
                .then((status) => {
                    resolve(status.deletedCount);
                })
                .catch(err => reject(err))
        })
    }
}