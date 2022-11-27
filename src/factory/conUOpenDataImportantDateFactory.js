const OpenDataImportantDate = require('../models/conUOpenDataImportantDate.model');

function createOpenDataImportantDate(data) {
    const date = data.date;
    const description = data.description;

    return new OpenDataImportantDate({
        date,
        description
    })
}
module.exports = { createOpenDataImportantDate };