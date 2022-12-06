const { createOpenDataFaculty } = require("../factory/conUOpenDataFacultyFactory");
const OpenDataFaculty = require('../models/conUOpenDataFaculty.model');
const axios = require("axios");

module.exports = class OpenDataFacultyRepository {
    /**
     * Create a department record with its associated faculty.
     * @param {*} data The body/params of the request. It should contain: facultyCode, facultyDescription, departmentCode, departmentDescription.
     * @returns {Faculty} Returns a promise. Resolves with the studyRoom.
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

    /**
     * Find all departments in a specific faculty.
     * @param {string} facultyCode, the faculty code of interest.
     * @returns {[Faculty]} Returns a promise. Resolves with an array of Faculty with the provided facultyCode param.
     */
    static findAllByFacultyCode(facultyCode) {
        return new Promise((resolve, reject) => {
            OpenDataFaculty.find({
                facultyCode: { "$in": [facultyCode.toUpperCase()] }
            })
                .then((result) => {
                    resolve(result);
                })
                .catch(err => reject(err))
        })
    }

    /**
     * Find all faculty codes and faculty descriptions in the university.
     * @returns {[Faculty]} Returns a promise. Resolves with an array of faculty codes and descriptions in the university.
     */
    static getFacultyList() {
        return new Promise((resolve, reject) => {
            OpenDataFaculty.aggregate([{
                $group: {
                    _id: {
                        facultyCode: '$facultyCode',
                        facultyDescription: '$facultyDescription'
                    }
                }
            }])
                .then((result) => {
                    const cleanedResult = [];
                    result.forEach((item) => {
                        cleanedResult.push(item._id);
                    })
                    resolve(cleanedResult);
                })
                .catch(err => reject(err))
        })
    }

    /**
     * Drops the opendatafaculties table
     * @returns {boolean}, returns true if the table is dropped, returns false if the table is not dropped
     */
    static dropTable() {
        return new Promise((resolve, reject) => {
            OpenDataFaculty.collection.drop().then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            })
        })
    }

    /**
     * Creates table of Faculty records using an array of Faculty records.
     * @param {[Faculty]} takes an array of Faculty to be added to the opendatafaculties collection in the database
     * @returns {[Faculty]} Returns a promise. Resolves with an array of Faculties added to the table.
     */
    static batchCreateFaculty(facultiesData) {
        return new Promise((resolve, reject) => {
            OpenDataFaculty.insertMany(facultiesData, (err, docs) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(docs);
                }
            })
        })
    }

    /**
     * Refreshes Faculty data in the openadatafaculties table using the faculty data in Concordia's Open Data
     */
    static refreshFacultyData() {
        console.log("> [INFO][REFRESH START]: of opendatafaculties table");

        axios.get("https://opendata.concordia.ca/API/v1/course/faculty/filter/*/*", {
            auth: {
                username: process.env.OPEN_DATA_USERNAME,
                password: process.env.OPEN_DATA_PASSWORD
            }
        }).then((result) => {
            console.info("> [INFO] Origin OpenData Faculties size: " + result.data.length);
            let data = JSON.parse(JSON.stringify(result.data).split('"deparmentCode":').join('"departmentCode":')); // replaces key name 'deparmentCode' from source data to 'departmentCode'
            data = JSON.parse(JSON.stringify(data).split('"deparmentDescription":').join('"departmentDescription":')); // replaces key name 'deparmentDescription' from source data to 'departmentDescription'
            this.dropTable().then((res) => {
                console.info("— [INFO][COLLECTION DROP] opendatafaculties collection dropped: " + res);

                this.batchCreateFaculty(data).then((res) => {
                    console.info('+ [INFO][REFRESH COMPLETE] %d faculties were successfully added to opendatafaculties collection.', res.length);
                }).catch((err) => {
                    console.error(err);
                    console.error('[ERR][REFRESH FAILED]: Could not insert data into the opendatafaculties collection.');
                });
            }).catch((err) => {
                console.error(err);
                console.error('[ERR][REFRESH FAILED]: Could not drop the opendatafaculties collection.');
            });
        }).catch((err) => {
            console.error(err);
            console.error('[ERR][REFRESH FAILED]: Could not fetch Faculty data from Concordia University Open Data.');
        });
    }
}