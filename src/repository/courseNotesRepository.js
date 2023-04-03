const CourseNotes = require('../models/courseNotes.model');
const CourseNoteData = require('../models/courseNoteData.model');
const createCourseNotes = require("../factory/courseNotesFactory");
const createCourseNoteData = require("../factory/courseNoteDataFactory")
const fs = require('fs');
const util = require('util');

const Multer = require('multer');

// create multer instance
const multer = Multer({
    dest: "tmp/files",
    limits: {
        fileSize: 8000000
    }
});

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
                return new Promise((resolve, reject) => {
                    const newCourseNotes = createCourseNotes(data)
                    newCourseNotes.save((err, event) => {
                        if (err) {
                            reject("Could not upload file!");
                        }

                        const courseNoteData = createCourseNoteData(event.courseNoteID, bufferedFile);
                        courseNoteData.save((err) => {
                            if (err)
                                reject("Could not upload file; only file metadata was saved!");
                            resolve(event);
                        })
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
                // stringify then parse the resulting document to properly recognise it as a json for manipulation
                // using the map function
                courseNotes = JSON.stringify(courseNotes);
                courseNotes = JSON.parse(courseNotes);

                //removing the bufferedFile attribute from the resulting file list
                let newCourseNotes = courseNotes.map(({bufferedFile, ...remainingCourseNotesAttrs}) => {
                    return remainingCourseNotesAttrs;
                })
                resolve(newCourseNotes);
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
                CourseNoteData.findOne({courseNoteID: courseNoteID.toString()}).then((fileDataBuffer) => {
                    let updatedCourseNote = JSON.stringify(courseNotes);
                    updatedCourseNote = JSON.parse(updatedCourseNote);
                    updatedCourseNote.bufferedFile = fileDataBuffer.bufferedFile;

                    resolve(updatedCourseNote);
                }).catch(() => {
                    reject("File not found!")
                });
            }).catch(() => reject("File data not found!"))
        })
    }

    /**
     * Delete one courseNotes by its courseNotesID.
     * @param {string} courseNoteID The courseNotesID of the courseNotes.
     * @returns {number} Returns a promise. Resolves with the number of courseNotes deleted (1 or 0).
     */
    static deleteOne(courseNoteID) {
        return new Promise((resolve, reject) => {
            CourseNoteData.deleteOne({courseNoteID: courseNoteID.toString()}).then(() => {
                CourseNotes.deleteOne({courseNoteID: courseNoteID.toString()})
                    .then((status) => {

                        resolve(status.deletedCount);
                    })
                    .catch(() => reject("Could not delete file metadata!"))
            }).catch(() => reject("Could not delete file!"))
        })
    }

    static fileUploadErrorMiddleware(req, res, next) {
        const upload = multer.single('file');

        upload(req, res, function (err) {
            if (err) {
                res.status(400).json(err);
            } else
                next();
        })
    }
}