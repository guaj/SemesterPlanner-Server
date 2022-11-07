const router = require('express').Router();
let Event = require('../models/event.model');
const mongoose = require("mongoose");

/**
 * Get all events of a certain student
 */
router.route('/').get((req, res) => {
    Event.find({ username: req.body.username })
        .then(events => res.json(events))
        .catch(err => res.status(400).json('Error: ' + err));
});

/**
 * Get event by eventId
 */
router.route('/:username').get((req, res) => {
    Event.find({ username: req.params.username })
        .then(event => res.json(event))
        .catch(err => res.status(400).json('Error: ' + err));
});

/**
 * Delete an event by eventId
 */
router.route('/:username').delete((req, res) => {
    Event.findOneAndDelete({ username: req.params.username })
        .then(event => res.json(`Event deleted`))
        .catch(err => res.status(400).json('Error: ' + err));
});

/**
 * Update an event
 */
router.route('/update').post( async (req, res) => {
    Event.findOne({ _id: new mongoose.Schema.Types.ObjectId(req.body._id) })
        .then(event => {
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
                event.startDate = req.body.startDate;
            }
            if (req.body.endDate) {
                event.endDate = req.body.endDate;
            }
            if (req.body.startTime) {
                event.startTime = req.body.startTime;
            }
            if (req.body.endTime) {
                event.endTime = req.body.endTime;
            }
            if (req.body.reccurence) {
                event.reccurence = req.body.reccurence;
            }
            if (req.body.color) {
                event.color = req.body.color;
            }

            event.save()
                .then(() => res.json(`Event ${event.eventHeader} updated`))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

/**
 * Add an event
 */
router.route('/add').post( async (req, res) => {
    console.log(req)
    const username = req.body.username;
    const eventHeader = req.body.eventHeader;
    const description = req.body.description;
    const link = req.body.link;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const startTime = req.body.startTime;
    const endTime = req.body.endTime;
    const reccurence = req.body.reccurence;
    const color = req.body.color;

    const newEvent = new Event({
        username,
        eventHeader,
        description,
        link,
        startDate,
        endDate,
        startTime,
        endTime,
        reccurence,
        color
    })

    newEvent.save()
        .then(() => res.json(`Event ${eventHeader} added`))
});

module.exports = router;