const axios = require("axios");
const OpenDataFacultyRepository = require("../repository/conUOpenDataFacultyRepository");
const OpenDataCourseRepository = require("../repository/conUOpenDataCourseRepository");
const OpenDataImportantDateRepository = require("../repository/conUOpenDataImportantDateRepository");
const router = require('express').Router();


// runs once on server start then refreshes open data once every 24 hours
setInterval(
    function openDataRefresh() {
        axios.get("https://opendata.concordia.ca/API/v1/course/faculty/filter/*/*", {
            auth: {
                username: process.env.OPEN_DATA_USERNAME,
                password: process.env.OPEN_DATA_PASSWORD
            }
        }).then((result) => {
            console.info("Origin OpenData Faculties size: " + result.data.length);
            let data = JSON.parse(JSON.stringify(result.data).split('"deparmentCode":').join('"departmentCode":')); // replaces key name 'deparmentCode' from source data to 'departmentCode'
            data = JSON.parse(JSON.stringify(data).split('"deparmentDescription":').join('"departmentDescription":')); // replaces key name 'deparmentDescription' from source data to 'departmentDescription'
            OpenDataFacultyRepository.dropTable().then((res) => {
                console.info("opendatafaculties collection dropped: " + res);

                OpenDataFacultyRepository.batchCreateFaculty(data).then((res) => {
                    console.info('%d faculties were successfully added to opendatafaculties collection.', res.insertedCount);
                }).catch((err) => {
                    console.error(err);
                });
            }).catch((err) => {
                console.error(err);
            });
        }).catch((err) => {
            console.error(err);
        });

        axios.get("https://opendata.concordia.ca/API/v1/course/catalog/filter/*/*/*", {
            auth: {
                username: process.env.OPEN_DATA_USERNAME,
                password: process.env.OPEN_DATA_PASSWORD
            }
        }).then((result) => {
            console.info("Origin OpenData Courses size: " + result.data.length);
            OpenDataCourseRepository.dropTable().then((res) => {
                console.info("opendatacourses collection dropped: " + res);

                OpenDataCourseRepository.batchCreateCourse(result.data).then((res) => {
                    console.info('%d courses were successfully added to opendatacourses collection.', res.insertedCount);
                }).catch((err) => {
                    console.error(err);
                });
            }).catch((err) => {
                console.error(err);
            });
        }).catch((err) => {
            console.error(err);
        });

        OpenDataImportantDateRepository.getImportantDates().then((result) => {
            console.info("Origin OpenData Important Dates Courses size: " + result.length);

            OpenDataImportantDateRepository.dropTable().then((res) => {
                console.info("opendataimportantcourses collection dropped: " + res);
                OpenDataImportantDateRepository.batchCreateImportantDate(result).then((res) => {
                    console.info('%d courses were successfully added to opendataimportantdates collection.', res.insertedCount);
                }).catch((err) => {
                    console.error(err);
                });
            }).catch((err) => {
                console.error(err);
            });
        })

        return openDataRefresh;
    }(), 86400000);

/**
 * add a faculty to a department
 * @param {facultyCode, facultyDescription, departmentCode, departmentDescription}: passed as request body and added to the opendatafaculties collection
 */
router.route('/faculty/').post((req, res) => {
    OpenDataFacultyRepository.create(req.body)
        .then((faculty) => {
            res.json(`Faculty record ${faculty._id} created.`).status(200), console.log(`Faculty record ${faculty._id} created:\n` + faculty + "\n");
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

/**
 * find all departments in a faculty
 * @param facultyCode: passed in URL corresponds to the faculty of interest
 */
router.route('/faculty/:facultyCode').get(async (req, res) => {
    const facultyCode = req.params.facultyCode.toString()
    OpenDataFacultyRepository.findAllByFacultyCode(facultyCode)
        .then((faculty) => {
            res.json(faculty).status(200);
            console.info(`List of departments in faculty \'${facultyCode}\' fetched:\n` + faculty + "\n")
        })
        .catch(err => res.status(400).json('Error: ' + err));
})

/**
 * add a course
 * @param {ID,
 *     title,
 *     subject,
 *     catalog,
 *     career,
 *     classUnit,
 *     prerequisites,
 *     crosslisted}: passed as request body and added to the opendatafaculties collection
 */
router.route('/course/').post((req, res) => {
    OpenDataCourseRepository.create(req.body)
        .then((course) => {
            res.json(`Course record ${course._id} created.`).status(200), console.log(`Faculty record ${faculty._id} created:\n` + faculty + "\n");
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

/**
 * find all courses by course code
 * @param courseCode: passed in URL corresponds to the course code (eg. ENCS, SOEN, ENGR) of interest
 */
router.route('/course/:courseCode').get(async (req, res) => {
    const courseCode = req.params.courseCode.toString();
    OpenDataCourseRepository.findAllByCourseCode(courseCode)
        .then((course) => {
            res.json(course).status(200);
            console.info(`List of courses with course code \'${courseCode}\' fetched:\n` + course + "\n")
        })
        .catch(err => res.status(400).json('Error: ' + err));
})

/**
 * find a specific course by course code and course number
 * @param {courseCode, courseNumber}: passed in URL correspond to the course code (eg. ENCS, SOEN, ENGR) and number of interest
 */
router.route('/course/:courseCode/:courseNumber').get(async (req, res) => {
    const courseCode = req.params.courseCode.toString();
    const courseNumber = req.params.courseNumber.toString();
    OpenDataCourseRepository.findByCourseCodeAndNumber(courseCode, courseNumber)
        .then((course) => {
            res.json(course).status(200);
            console.info(`Record of course with course \'${courseCode} ${courseNumber}\' fetched:\n` + course + "\n")
        })
        .catch(err => res.status(400).json('Error: ' + err));
})

/**
 * get all important dates
 */
router.route('/importantdates/').get( async (req, res) => {
    console.info(`Important dates requested.`)

    OpenDataImportantDateRepository.getAllImportantDates().then((importantDates) => {
        res.json(importantDates).status(200);
        console.info(`Important dates returned.`);
    }).catch((err) => {
       console.error(err);
       res.status(400).json('Error: ' + err);
    })
})

module.exports = router;

