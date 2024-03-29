const router = require('express').Router();
const EventRepository = require('../repository/eventRepository');
const TokenVerify = require('../repository/tokenRepository').verifyJWTAuth;


/**
 * Get all events of a certain student
 */
router.route('/:username').get(TokenVerify, (req, res) => {
    EventRepository.findAllbyStudentUsername(req.params.username)
        .then(events => res.status(200).json(events))
        .catch(err => res.status(400).json('Error: ' + err));
});

/**
 * Get event by eventId
 */
router.route('/event/:eventID').get(TokenVerify, (req, res) => {
    EventRepository.findOneByID(req.params.eventID)
        .then(event => res.status(200).json(event))
        .catch(err => res.status(400).json('Error: ' + err));
});

/**
 * Get course events of a certain student within a week
 */
router.route('/study-events-weekly/:username').get(TokenVerify, (req, res) => {
    EventRepository.durationTypeUserEventFilter(req.params.username, 7, 'study')
        .then(events => res.status(200).json(events))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/events-weekly/:username').get(TokenVerify, (req, res) => {
    EventRepository.durationTypeUserEventFilter(req.params.username,7, 'all')
        .then(events => res.status(200).json(events))
        .catch(err => res.status(400).json('Error: ' + err));
});
router.route('/study-events-monthly/:username').get(TokenVerify, (req, res) => {
    EventRepository.durationTypeUserEventFilter(req.params.username, 30, 'study')
        .then(events => res.status(200).json(events))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/events-monthly/:username').get(TokenVerify, (req, res) => {
    EventRepository.durationTypeUserEventFilter(req.params.username, 30, 'all')
        .then(events => res.status(200).json(events))
        .catch(err => res.status(400).json('Error: ' + err));
});


/**
 * Delete an event by eventId
 */
router.route('/:eventID').delete(TokenVerify, (req, res) => {
    EventRepository.deleteOne(req.params.eventID)
        .then(() => {
            res.status(200).json(`Event deleted`);
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

/**
 * Update an event
 */
router.route('/update').post(TokenVerify, (req, res) => {
    EventRepository.findOneByID(req.body._id)
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
                event.startDate = new Date(req.body.startDate);
            }
            if (req.body.endDate) {
                event.endDate = new Date(req.body.endDate);
            }
            if (req.body.startTime) {
                event.startTime = new Date(req.body.startTime);
            }
            if (req.body.endTime) {
                event.endTime = new Date(req.body.endTime);
            }
            if (req.body.recurrence) {
                event.recurrence = req.body.recurrence;
            }
            if (req.body.color) {
                event.color = req.body.color;
            }
            if (req.body.type) {
                event.type = req.body.type;
                event.subject = req.body.subject;
                event.catalog = req.body.catalog;
            }
            if (req.body.actualStartTime)
                event.actualStartTime = req.body.actualStartTime;
            if (req.body.actualEndTime)
                event.actualEndTime = req.body.actualEndTime;
            if (req.body.studyHoursConfirmed)
                event.studyHoursConfirmed = req.body.studyHoursConfirmed;
            EventRepository.updateOne(event)
                .then(() => res.json(event))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json(err));
});

/**
 * Add an event
 */
router.route('/add').post(TokenVerify, async (req, res) => {
    EventRepository.create(req.body)
        .then((event) => {
            res.status(200).json(event)
        })
        .catch(err => { res.status(400).json(err); });
});

module.exports = router;