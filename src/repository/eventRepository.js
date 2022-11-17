const Event = require('../models/event.model');
const mongoose = require("mongoose");
const { createEvent } = require("../factory/eventFactory");

module.exports = class EventRepository {
    /**
     * Create an event.
     * @param {*} data The body/params of the request. It should contain: username, eventHeader, startDate, endDate, startTime, endTime, reccurence, color (optional), description (optional), link (optional)
     * @returns {Event} Returns a promise. Resolves with the event.
     */
    static create(data) {
        return new Promise((resolve, reject) => {
            createEvent(data).then((newEvent) => {
                newEvent.save((err, event) => {
                    if (err) { reject(err); }
                    resolve(event);
                })
            })
        })
    }

    /**
     * Find all events of student.
     * @param {*} data The body/params of the request. It should contain the username of the student.
     * @returns {[Event]} Returns a promise. Resolves with an array of events belonging to the student.
     */
    static findAllbyStudentUsername(data) {
        return new Promise((resolve, reject) => {
            Event.find({ username: data.username.toString() }).then((events, err) => {
                if (err) { reject(err); }
                resolve(events);
            })
        })
    }

    /**
     * Find one event by its eventID.
     * @param {*} data The body/params of the request. It should contain the eventID of the event.
     * @returns {Event} Returns a promise. Resolves with an event.
     */
    static findOne(data) {
        return new Promise((resolve, reject) => {
            Event.find({ eventID: data.eventID.toString() }).then((event, err) => {
                if (err) { reject(err); }
                resolve(event);
            })
        })
    }

    /**
     * Find one event by its MongoDB _id.
     * @param {*} data The body/params of the request. It should contain the _id of the event.
     * @returns {Event} Returns a promise. Resolves with an event.
     */
    static findOneByMongoID(data) {
        return new Promise((resolve, reject) => {
            Event.findById(data._id).then((event, err) => {
                if (err) { reject(err); }
                resolve(event);
            })
        })
    }


    /**
     * Delete one event by its eventID.
     * @param {*} data The body/params of the request. It should contain the eventID of the event.
     * @returns {number} Returns a promise. Resolves with the number of events deleted (1 or 0).
     */
    static deleteOne(data) {
        return new Promise((resolve, reject) => {
            Event.deleteOne({ eventID: data.eventID.toString() })
                .then((status, err) => {
                    if (err) { reject(err); }
                    resolve(status.deletedCount);
                })
        })
    }

    /**
     * Update an event by saving it to the database.
     * @param {*} event An updated event object.
     * @returns {Event}  Returns a promise. Resolves with the updated event.
     */
    static updateOne(event) {
        return new Promise((resolve, reject) => {
            event.save((err, event) => {
                if (err) { reject(err); }
                resolve(event);
            })
        })
    }
}