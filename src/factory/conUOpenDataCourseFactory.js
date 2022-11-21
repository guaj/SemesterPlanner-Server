const OpenDataCourse = require('../models/conUOpenDataCourse.model');

function createOpenDataCourse(data) {
    const ID = data.ID;
    const title = data.title;
    const subject = data.subject;
    const catalog = data.catalog;
    const career = data.career;
    const classUnit = data.classUnit;
    const prerequisites = data.prerequisites;
    const crosslisted = data.crosslisted;

    return new OpenDataCourse({
        ID,
        title,
        subject,
        catalog,
        career,
        classUnit,
        prerequisites,
        crosslisted
    })
}
module.exports = { createOpenDataCourse };