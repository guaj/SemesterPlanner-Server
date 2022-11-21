const Event = require('../models/event.model');
const { createEvent } = require("../factory/eventFactory");

module.exports = class EventRepository {

    /**
     * Create an event.
     * @param {*} data The body/params of the request. It should contain: username, eventHeader, startDate, endDate, startTime, endTime, reccurence, color (optional), description (optional), link (optional)
     * @returns {Event} Returns a promise. Resolves with the event.
     */
    static create(data) {
        return new Promise((resolve, reject) => {
            const newEvent = createEvent(data)
            newEvent.save((err, event) => {
                if (err) { reject(err); }
                resolve(event);
            })
        })
    }

    /**
     * Find all events of student.
     * @param {string} username The username of the student.
     * @returns {[Event]} Returns a promise. Resolves with an array of events belonging to the student.
     */
    static findAllbyStudentUsername(username) {
        return new Promise((resolve, reject) => {
            Event.find({ username: username.toString() }).then((events) => {
                resolve(events);
            })
                .catch(err => reject(err))
        })
    }

    /**
     * Find one event by its eventID.
     * @param {string} eventID The eventID of the event.
     * @returns {Event} Returns a promise. Resolves with an event.
     */
    static findOne(eventID) {
        return new Promise((resolve, reject) => {
            Event.findOne({ eventID: eventID.toString() }).then((event) => {
                resolve(event);
            })
                .catch(err => reject(err))
        })
    }

    /**
     * Find one event by its MongoDB _id.
     * @param {*} _id The _id of the event.
     * @returns {Event} Returns a promise. Resolves with an event.
     */
    static findOneByID(_id) {
        return new Promise((resolve, reject) => {
            Event.findById(_id).then((event) => {
                resolve(event);
            })
                .catch(err => reject(err))
        })
    }

    /**
     * Delete one event by its eventID.
     * @param {string} eventID The eventID of the event.
     * @returns {number} Returns a promise. Resolves with the number of events deleted (1 or 0).
     */
    static deleteOne(eventID) {
        return new Promise((resolve, reject) => {
            Event.deleteOne({ eventID: eventID.toString() })
                .then((status) => {
                    resolve(status.deletedCount);
                })
                .catch(err => reject(err))
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