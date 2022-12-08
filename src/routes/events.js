const router = require('express').Router();
const EventRepository = require('../repository/eventRepository')
const StudentRepository = require('../repository/studentRepository');
const OpenDataCourseRepository = require("../repository/conUOpenDataCourseRepository");

/**
 * Get all events of a certain student
 */
router.route('/:username').get((req, res) => {
    EventRepository.findAllbyStudentUsername(req.params.username)
        .then(events => res.status(200).json(events))
        .catch(err => res.status(400).json('Error: ' + err));
});

/**
 * Get event by eventId
 */
router.route('/event/:eventID').get((req, res) => {
    EventRepository.findOne(req.params.eventID)
        .then(event => res.status(200).json(event))
        .catch(err => res.status(400).json('Error: ' + err));
});

/**
 * Delete an event by eventId
 */
router.route('/:eventID').delete((req, res) => {
    EventRepository.deleteOne(req.params.eventID)
        .then(async (event) => {
            if (event.type == 'course') {
                let courses = await EventRepository.findByCourse(event.username, event.subject, event.catalog);
                if (courses.length == 0) {
                    let student = await StudentRepository.findOneByUsername(event.username);
                    let studentCourses = student.courses;
                    let index = studentCourses.findIndex(function (course, i) {
                        return (course.subject === event.subject && course.catalog === event.catalog);
                    });
                    studentCourses.splice(index, 1);
                    await StudentRepository.updateCourses(event.username, studentCourses);
                }
            }
            res.status(200).json(`Event deleted`);
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

/**
 * Update an event
 */
router.route('/update').post(async (req, res) => {
    EventRepository.findOne(req.body._id)
        .then((event) => {
            if (req.body.eventHeader) {
                event.eventHeader = req.body.eventHeader;
            }
            if (req.body.description) {
                event.description = req.body.description;
            }
            if (req.body.link) {
                event.link = req.body.link;
            }
            if (req.body.startDate) {
                event.startDate = Date(req.body.startDate);
            }
            if (req.body.endDate) {
                event.endDate = Date(req.body.endDate);
            }
            if (req.body.startTime) {
                event.startTime = Date(req.body.startTime);
            }
            if (req.body.endTime) {
                event.endTime = Date(req.body.endTime);
            }
            if (req.body.reccurence) {
                event.reccurence = req.body.reccurence;
            }
            if (req.body.color) {
                event.color = req.body.color;
            }
            EventRepository.updateOne(event)
                .then(() => res.json(event))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json(err));
});

/**
 * Add an event
 */
router.route('/add').post(async (req, res) => {
    EventRepository.create(req.body)
        .then(async (event) => {

            // Add course to student if doesn't already exist in student's courses list.
            if (event.type == 'course') {
                let student = await StudentRepository.findOneByUsername(event.username)
                let courses = student.courses;
                let conUCourse = await OpenDataCourseRepository.findByCourseCodeAndNumber(event.subject, event.catalog)
                let course = {
                    'title': conUCourse.title,
                    'subject': event.subject,
                    'catalog': event.catalog,
                    'classUnit': conUCourse.classUnit,
                    'studyHours': (parseFloat(conUCourse.classUnit) * 1.5).toString()
                }
                if (!(courses.some(item => _.isEqual(item, course)))) {
                    courses.push(course);
                    await StudentRepository.updateCourses(event.username, courses);
                }

            }

            res.status(200).json(event)
        })
        .catch(err => res.status(400).json(err));
});

module.exports = router;