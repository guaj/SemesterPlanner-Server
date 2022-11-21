const OpenDataFaculty = require('../models/conUOpenDataFaculty.model');

function createOpenDataFaculty(data) {
    const facultyCode = data.facultyCode;
    const facultyDescription = data.facultyDescription;
    const departmentCode = data.departmentCode;
    const departmentDescription = data.departmentDescription

    return new OpenDataFaculty({
        facultyCode,
        facultyDescription,
        departmentCode,
        departmentDescription
    })
}
module.exports = { createOpenDataFaculty };