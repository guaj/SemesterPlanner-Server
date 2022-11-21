const axios = require("axios");
const OpenDataFacultyRepository = require("../repository/conUOpenDataFacultyRepository");
const router = require('express').Router();

// refreshes open data once every 24 hours
setInterval(
    function openDataRefresh() {
        axios.get("https://opendata.concordia.ca/API/v1/course/faculty/filter/*/*", {
            auth: {
                username: "510",
                password: "2728c6ad01f348c103f411c27c910408"
            }
        }).then((result) => {
            console.info("Origin OpenData Faculties size: " + result.data.length);
            let data = JSON.parse(JSON.stringify(result.data).split('"deparmentCode":').join('"departmentCode":')); // replaces key name 'deparmentCode' from source data to 'departmentCode'
            data = JSON.parse(JSON.stringify(data).split('"deparmentDescription":').join('"departmentDescription":')); // replaces key name 'deparmentDescription' from source data to 'departmentDescription'
            OpenDataFacultyRepository.dropTable().then((res) => {
                console.info("opendatafaculties collection dropped: " + res);
            }).catch((err) => {
                console.error(err);
            });
            OpenDataFacultyRepository.batchCreateFaculty(data).then((res) => {
                console.info('%d faculties were successfully added to opendatafaculties collection.', res.insertedCount);
            }).catch((err) => {
                console.error(err);
            });
        }).catch((err) => {
            console.error(err);
        });
        return openDataRefresh;
    }(), 86400000);

/**
 * add a faculty to a department
 * @param facultyCode,facultyDescription,departmentCode,departmentDescription passed as request body and added to the opendatafaculties collection
 */
router.route('/').post((req, res) => {
    OpenDataFacultyRepository.create(req.body)
        .then((faculty) => {
            res.json(`Faculty record ${faculty._id} created.`).status(200), console.log(`Faculty record ${faculty._id} created:\n` + faculty + "\n");
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

/**
 * find all departments in a faculty
 * @param facultyCode passed in URL corresponds to the faculty of interest
 */
router.route('/:facultyCode').get(async (req, res) => {
    const facultyCode = req.params.facultyCode.toString()
    OpenDataFacultyRepository.findAllByFacultyCode(facultyCode)
        .then((faculty) => {
            res.json(faculty).status(200);
            console.info(`List of departments in faculty \'${facultyCode}\' fetched:\n` + faculty + "\n")
        })
        .catch(err => res.status(400).json('Error: ' + err));
})

module.exports = router;

