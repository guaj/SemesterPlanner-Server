const OpenDataFacultyRepository = require("../repository/conUOpenDataFacultyRepository");
const OpenDataCourseRepository = require("../repository/conUOpenDataCourseRepository");
const OpenDataImportantDateRepository = require("../repository/conUOpenDataImportantDateRepository");
const router = require('express').Router();


/** runs once on server start then refreshes open data once every 24 hours (if --odrefreshinterval param is not
 * specified or is more that 24 [days]; else refreshes every 'odrefreshinterval' days); open data refresh is not
 * run if --odrefresh param is not set to true
 */
if (process.env.npm_config_odrefresh === "true")
    setInterval(
        function openDataRefresh() {
            console.log('Refreshing OpenData database.')
            OpenDataFacultyRepository.refreshFacultyData();
            OpenDataCourseRepository.refreshCourseData();
            OpenDataImportantDateRepository.refreshImportantDateData();

            return openDataRefresh;
        }(), (process.env.npm_config_odrefreshinterval && Number.isInteger(Number(process.env.npm_config_odrefreshinterval) && Number(process.env.npm_config_odrefreshinterval) <= 24) ? (Number(process.env.npm_config_odrefreshinterval) * 86400000) : 86400000));

/**
 * add a faculty to a department
 * @param {String} facultyCode: passed in the request body and added to the newly created record in the opendatafaculties collection
 * @param {String} facultyDescription: passed in the request body and added to the newly created record in the opendatafaculties collection
 * @param {String} departmentCode: passed in the request body and added to the newly created record in the opendatafaculties collection
 * @param {String} departmentDescription: passed in the request body and added to the newly created record in the opendatafaculties collection
 * @returns {string} Returns a string with the operation's result.
 */
router.route('/faculty/').post((req, res) => {
    OpenDataFacultyRepository.create(req.body)
        .then((faculty) => {
            res.json(`Faculty record ${faculty._id} created.`).status(200);
            console.log(`Faculty record ${faculty._id} created:\n` + faculty + "\n");
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

/**
 * get list of all faculty codes and faculty descriptions in the university
 * @returns [faculties] Returns an array of faculty codes and faculty descriptions in the university.
 */
router.route('/faculty/').get(async (req, res) => {
    OpenDataFacultyRepository.getFacultyList()
        .then((faculty) => {
            res.json(faculty).status(200);
            console.info("List of faculties fetched:");
            console.info(faculty);
        })
        .catch(err => res.status(400).json('Error: ' + err));
})

/**
 * find all departments in a faculty
 * @param {String} facultyCode: passed in URL corresponds to the faculty of interest
 * @returns {[Faculty]} Returns an array of Faculty with the provided facultyCode param.
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
 * @param {String} ID, passed as part of the request body and added to the newly created record in the opendatafaculties collection
 * @param {String} title, passed as part of the request body and added to the newly created record in the opendatafaculties collection
 * @param {String} subject, passed as part of the request body and added to the newly created record in the opendatafaculties collection
 * @param {String} catalog, passed as part of the request body and added to the newly created record in the opendatafaculties collection
 * @param {String} career, passed as part of the request body and added to the newly created record in the opendatafaculties collection
 * @param {String} classUnit, passed as part of the request body and added to the newly created record in the opendatafaculties collection
 * @param {String} prerequisites, passed as part of the request body and added to the newly created record in the opendatafaculties collection
 * @param {String} crosslisted, passed as part of the request body and added to the newly created record in the opendatafaculties collection
 * @returns {String} Returns a string with the operation's result.
 */
router.route('/course/').post((req, res) => {
    OpenDataCourseRepository.create(req.body)
        .then((course) => {
            res.json(`Course record ${course._id} created.`).status(200);
            console.log(`Faculty record ${faculty._id} created:\n` + faculty + "\n");
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

/**
 * find all courses by course code
 * @param {String} courseCode: passed in URL corresponds to the course code (eg. ENCS, SOEN, ENGR) of interest
 * @returns {[Course]} Returns an array of Courses associated with the courseCode param.
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
 * @param {String} courseCode: passed in URL correspond to the course code (eg. ENCS, SOEN, ENGR)
 * @param {String, Integer} courseNumber: passed in URL correspond to the course number (eg. 282, 490, 301)
 * @returns {[Course]} Returns a Course record associated with the courseCode and courseNumber param.
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
 * Get the amount of study hours of a specific course by course code and course number
 * @param {String} courseCode: passed in URL correspond to the course code (eg. ENCS, SOEN, ENGR)
 * @param {String, Integer} courseNumber: passed in URL correspond to the course number (eg. 282, 490, 301)
 * @returns {[Course]} Returns a Course record associated with the courseCode and courseNumber param.
 */
router.route('/course/studyhours/:courseCode/:courseNumber').get(async (req, res) => {
    const courseCode = req.params.courseCode.toString();
    const courseNumber = req.params.courseNumber.toString();
    OpenDataCourseRepository.findByCourseCodeAndNumber(courseCode, courseNumber)
        .then((course) => {
            console.info(`Record of course with course \'${courseCode} ${courseNumber}\' fetched:\n` + course + "\n")
            let studyHours = parseFloat(course.classUnit) * 1.5;
            res.status(200).json({ 'studyHours': studyHours });
        })
        .catch(err => res.status(400).json('Error: ' + err));
})

/**
 * get all important dates
 * @returns {[ImportantDate]} Returns an array with the ImportantDate records.
 */
router.route('/importantdates/').get(async (req, res) => {
    console.info(`Important dates requested.`)

    OpenDataImportantDateRepository.getAllImportantDates().then((importantDates) => {
        res.status(200).json(importantDates);
        console.info(`Important dates returned.`);
    }).catch((err) => {
        console.error(err);
        res.status(400).json('Error: ' + err);
    })
})

module.exports = router;

