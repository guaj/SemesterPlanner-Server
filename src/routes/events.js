const router = require('express').Router();
let Event = require('../models/event.model');
const mongoose = require("mongoose");
const {createEvent, editEvent} = require("../factory/eventFactory");

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
            event = editEvent(req.body)
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
    const newEvent = createEvent(req.body)
    newEvent.save()
        .then(() => res.json(`Event ${eventHeader} added`))
});

module.exports = router;