const OpenDataFacultyRepository = require("../repository/conUOpenDataFacultyRepository");
const OpenDataCourseRepository = require("../repository/conUOpenDataCourseRepository");
const OpenDataImportantDateRepository = require("../repository/conUOpenDataImportantDateRepository");
const router = require('express').Router();


// runs once on server start then refreshes open data once every 24 hours
// setInterval(
//     function openDataRefresh() {
//         OpenDataFacultyRepository.refreshFacultyData();
//         OpenDataCourseRepository.refreshCourseData();
//         OpenDataImportantDateRepository.refreshImportantDateData();
//
//         return openDataRefresh;
//     }(), 86400000);

/**
 * add a faculty to a department
 * @param {facultyCode, facultyDescription, departmentCode, departmentDescription}: passed as request body and added to the opendatafaculties collection
 * @returns {string} Returns a string with the operation's result.
 */
router.route('/faculty/').post((req, res) => {
    OpenDataFacultyRepository.create(req.body)
        .then((faculty) => {
            res.json(`Faculty record ${faculty._id} created.`).status(200), console.log(`Faculty record ${faculty._id} created:\n` + faculty + "\n");
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
 * @param facultyCode: passed in URL corresponds to the faculty of interest
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
 * @param {ID,
 *     title,
 *     subject,
 *     catalog,
 *     career,
 *     classUnit,
 *     prerequisites,
 *     crosslisted}: passed as request body and added to the opendatafaculties collection
 * @returns {string} Returns a string with the operation's result.
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
 * @returns [{Course}] Returns an array of Courses associated with the courseCode param.
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
 * @returns [{Course}] Returns an array containing a Course record associated with the courseCode and courseNumber param.
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
 * @returns [{ImportantDate}] Returns an array with the ImportantDate records.
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

