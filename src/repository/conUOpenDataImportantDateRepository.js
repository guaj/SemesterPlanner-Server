const {createOpenDataImportantDate} = require("../factory/conUOpenDataImportantDateFactory");
const OpenDataImportantDate = require('../models/conUOpenDataImportantDate.model');
const got = (...args) =>
    import('got').then(({default: got}) => got(...args));
const cheerio = require("cheerio");

module.exports = class openDataImportantDateRepository {
    /**
     * Create a studyRoom.
     * @param {*} data The body/params of the request. It should contain: owner (email), color, participant, title, description (optional), avatarText (optional).
     * @returns {StudyRoom} Returns a promise. Resolves with the studyRoom.
     */
    static create(data) {
        return new Promise((resolve, reject) => {
            const newOpenDataImportantDate = createOpenDataImportantDate(data)
            newOpenDataImportantDate.save((err, importantDate) => {
                if (err) {
                    reject(err);
                }
                resolve(importantDate);
            })
        })
    }

    static getAllImportantDates(){
        return new Promise((resolve, reject) => {
            OpenDataImportantDate.find({})
                .then((result) => {
                    resolve(result);
                })
                .catch(err => reject(err))
        })
    }

    static getText(textNode) {
        let string = "";

        textNode.children.forEach((item) => {
            if (item.data) {
                string += item.data.trim() + " ";
            } else if (item.children[0])
                if (item.children[0].data)
                    string += item.children[0].data.trim() + " ";
        })
        return string.trim();
    }

    static getImportantDates() {
        let isCurrentYear = true;
        const currentYear = new Date().getFullYear();
        let importantDates = [];

        // get html text from concordia academic dates
        const vgmUrl = 'https://www.concordia.ca/academics/graduate/calendar/current/academic-calendar/current-academic-calendar-dates.html';

        return new Promise((resolve, reject) => {
            got(vgmUrl).then(response => {
                const $ = cheerio.load(response.body);
                $('div.date').each((i, element) => {
                    if (element.children[0].data.trim().includes("Jan.")) {
                        isCurrentYear = false;
                    }
                    const string = element.children[0].data.trim() + ", " + (isCurrentYear ? currentYear : currentYear + 1) + " : " + this.getText($('div.text')[i]);
                    const date = new Date(string.split(":")[0]);
                    const importantDate = {
                        'date': date.toLocaleDateString(),
                        'description': string.split(":")[1].trim()
                    };
                    importantDates.push(importantDate);
                })
                resolve(importantDates);
            }).catch(err => {
                reject(err);
            });
        });
    };

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
    // /**
    //  * Find all studyRooms of student.
    //  * @param {string} email The username of the student.
    //  * @returns {[StudyRoom]} Returns a promise. Resolves with an array of stutyRooms the student is a part of.
    //  */
    // static findAllByCourseCode(courseCode) {
    //     return new Promise((resolve, reject) => {
    //         OpenDataCourse.find({
    //             subject: {"$in": [courseCode.toUpperCase()]}
    //         })
    //             .then((result) => {
    //                 resolve(result);
    //             })
    //             .catch(err => reject(err))
    //     })
    // }

    // static findByCourseCodeAndNumber(courseCode, courseNumber) {
    //     return new Promise((resolve, reject) => {
    //         OpenDataCourse.find({
    //             subject: {"$in": [courseCode.toUpperCase()]},
    //             catalog: {"$in": [courseNumber.toString()]}
    //         })
    //             .then((result) => {
    //                 resolve(result);
    //             })
    //             .catch(err => reject(err))
    //     })
    // }

    static dropTable() {
        return new Promise((resolve, reject) => {
            OpenDataImportantDate.collection.drop().then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            })
        })
    }

    static batchCreateImportantDate(importantDateData) {
        return new Promise((resolve, reject) => {
            OpenDataImportantDate.collection.insertMany(importantDateData, (err, docs) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(docs);
                }
            })
        })
    }
}