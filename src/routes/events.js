const router = require('express').Router();
const EventRepository = require('../repository/eventRepository')

/**
 * Get all events of a certain student
 */
router.route('/:username').get((req, res) => {
    EventRepository.findAllbyStudentUsername(req.params.username)
        .then(events => res.json(events))
        .catch(err => res.status(400).json('Error: ' + err));
});

/**
 * Get event by eventId
 */
router.route('/event/:eventID').get((req, res) => {
    EventRepository.findOne(req.params.eventID)
        .then(event => res.json(event))
        .catch(err => res.status(400).json('Error: ' + err));
});

/**
 * Delete an event by eventId
 */
router.route('/:eventID').delete((req, res) => {
    EventRepository.deleteOne(req.params.eventID)
        .then(() => res.json(`Event deleted`))
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
            if (req.body.type) {
                event.type = req.body.type;
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
        .then((event) => res.json(event))
        .catch(err => res.status(400).json(err));
});

module.exports = router;