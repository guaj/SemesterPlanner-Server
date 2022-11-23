const router = require('express').Router();
const axios = require('axios');

/**
 * Get all events of a certain student
 */
router.route('/schedule/:courseId/:subject/:catalog').get(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    try {
        const scheduleData = await fetchConcordiaSchedule(req.params.courseId, req.params.subject, req.params.catalog)
            console.log(`scheduleData`, scheduleData)
            return scheduleData
    } catch (err) {
        res.status(400).json('Error: ' + err)
    }
    ;
});

/**
 * Service to fetch current Concordia schedule for the given parameters
 * @param courseId ID of unique course (ex. Course 002625 of BIOL201)
 * @param subject Subject of course (ex. BIOL)
 * @param catalog Course number (ex. 201)
 * @returns {Promise<void>}
 */
const fetchConcordiaSchedule = async (courseId, subject, catalog) => {
    await axios.get(`https://opendata.concordia.ca/API/v1/course/schedule/filter/${courseId}/${subject}/${catalog}`, {
        auth: {
            username: '512',
            password: '216795d408c460f17789580229c48082'
        }
    }).then((scheduleData) => {
        console.log(`scheduleData.data`,scheduleData.data)
        return scheduleData.data
    }).catch((e) => {
        console.log(`Error: ${e}`)
    })
}

module.exports = router;