const {createOpenDataCourse} = require("../factory/conUOpenDataCourseFactory");
const OpenDataCourse = require('../models/conUOpenDataCourse.model');
const axios = require("axios");

module.exports = class OpenDataCourseRepository {
    /**
     * Create a course record.
     * @param {*} data The body/params of the request. It should contain: ID, title, subject, catalog, career, classUnit, prerequisite, crosslisted.
     * @returns {Course}, Returns a promise. Resolves with the Course.
     */
    static create(data) {
        return new Promise((resolve, reject) => {
            const newOpenDataCourse = createOpenDataCourse(data)
            newOpenDataCourse.save((err, course) => {
                if (err) {
                    reject(err);
                }
                resolve(course);
            })
        })
    }

    /**
     * Find all courses with a specific course code.
     * @param {String} courseCode, the course code of interest.
     * @returns {[Course]} Returns a promise. Resolves with an array of Courses associated with the courseCode param.
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
     * @param {String} courseCode the course code of interest.
     * @param {String, Integer} courseNumber the course number of interest.
     * @returns {[Course]} Returns a promise. Resolves with an array of Course associated with the courseCode and courseNumber param.
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
     * @returns {boolean}, returns true if the table is dropped, returns false if the table is not dropped
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
     * @param {[Course]}, takes an array of Courses to be added to the opendatacourses collection in the database
     * @returns{[Course]} Returns a promise. Resolves with an array of Courses added to the table.
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

    /**
     * Refreshes Course data in the openadatacourses table using the course data in Concordia's Open Data
     */
    static refreshCourseData(){
        console.log("> [INFO][REFRESH START]: of opendatacourses table");

        axios.get("https://opendata.concordia.ca/API/v1/course/catalog/filter/*/*/*", {
            auth: {
                username: process.env.OPEN_DATA_USERNAME,
                password: process.env.OPEN_DATA_PASSWORD
            }
        }).then((result) => {
            console.info("> [INFO] Origin OpenData Courses size: " + result.data.length);
            this.dropTable().then((res) => {
                console.info("— [INFO][COLLECTION DROP] opendatacourses collection dropped: " + res);

                this.batchCreateCourse(result.data).then((res) => {
                    console.info('+ [INFO][REFRESH COMPLETE] %d courses were successfully added to opendatacourses collection.', res.insertedCount);
                }).catch((err) => {
                    console.error(err);
                    console.error('[ERR][REFRESH FAILED]: Could not insert data into the opendatacourses collection.');
                });
            }).catch((err) => {
                console.error(err);
                console.error('[ERR][REFRESH FAILED]: Could not drop the opendatacourses collection.');
            });
        }).catch((err) => {
            console.error(err);
            console.error('[ERR][REFRESH FAILED]: Could not fetch Course data from Concordia University Open Data.');
        });
    }
}