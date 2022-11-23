const {createOpenDataCourse} = require("../factory/conUOpenDataCourseFactory");
const OpenDataCourse = require('../models/conUOpenDataCourse.model');

module.exports = class openDataCourseRepository {
    /**
     * Create a course record.
     * @param {*} data The body/params of the request. It should contain: ID, title, subject, catalog, career, classUnit, prerequisite, crosslisted.
     * @returns {Course}, Returns a promise. Resolves with the Course.
     */
    static create(data) {
        return new Promise((resolve, reject) => {
            const newOpenDataCourse = createOpenDataCourse(data)
            newOpenDataCourse.save((err, faculty) => {
                if (err) {
                    reject(err);
                }
                resolve(faculty);
            })
        })
    }

    /**
     * Find all courses with a specific course code.
     * @param {string} courseCode, the course code of interest.
     * @returns [{Course}] Returns a promise. Resolves with an array of Courses associated with the courseCode param.
     */
    static findAllByCourseCode(courseCode) {
        return new Promise((resolve, reject) => {
            OpenDataCourse.find({
                subject: {"$in": [courseCode.toUpperCase()]}
            })
                .then((result) => {
                    resolve(result);
                })
                .catch(err => reject(err))
        })
    }

    /**
     * Find a specific course with a specific course code and course number.
     * @param {string} courseCode the course code of interest.
     * @param {string, int} courseNumber the course number of interest.
     * @returns [{Course}] Returns a promise. Resolves with an array of Course associated with the courseCode and courseNumber param.
     */
    static findByCourseCodeAndNumber(courseCode, courseNumber) {
        return new Promise((resolve, reject) => {
            OpenDataCourse.find({
                subject: {"$in": [courseCode.toUpperCase()]},
                catalog: {"$in": [courseNumber.toString()]}
            })
                .then((result) => {
                    resolve(result);
                })
                .catch(err => reject(err))
        })
    }

    /**
     * Drops the opendatacourses table
     * @returns boolean, returns true if the table is dropped, returns false if the table is not dropped
     */
    static dropTable() {
        return new Promise((resolve, reject) => {
            OpenDataCourse.collection.drop().then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            })
        })
    }

    /**
     * Creates table of Course records using an array of Course records.
     * @returns [{Course}] Returns a promise. Resolves with an array of Courses added to the table.
     */
    static batchCreateCourse(coursesData) {
        return new Promise((resolve, reject) => {
            OpenDataCourse.collection.insertMany(coursesData, (err, docs) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(docs);
                }
            })
        })
    }
}