const {createOpenDataFaculty} = require("../factory/conUOpenDataFacultyFactory");
const OpenDataFaculty = require('../models/conUOpenDataFaculty.model');

module.exports = class openDataFacultyRepository {
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
                facultyCode: {"$in": [facultyCode.toUpperCase()]}
            })
                .then((result) => {
                    resolve(result);
                })
                .catch(err => reject(err))
        })
    }

    /**
     * Find all faculties in the university.
     * @returns [faculties] Returns a promise. Resolves with an array of faculties in the university.
     */
    static getFacultyList() {
        return new Promise((resolve, reject) => {
            OpenDataFaculty.distinct('facultyDescription')
                .then((result) => {
                    resolve(result);
                })
                .catch(err => reject(err))
        })
    }

    /**
     * Drops the opendatafaculties table
     * @returns boolean, returns true if the table is dropped, returns false if the table is not dropped
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
     * @returns [{Faculty}] Returns a promise. Resolves with an array of Faculties added to the table.
     */
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