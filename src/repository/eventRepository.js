const Event = require('../models/event.model');
const { createEvent } = require("../factory/eventFactory");
const EventValidator = require('../validator/eventValidator')

module.exports = class EventRepository {

    /**
     * Create an event.
     * @param {*} data The body/params of the request. It should contain: username, eventHeader, startDate, endDate, startTime, endTime, reccurence, color (optional), description (optional), link (optional)
     * @returns {Event} Returns a promise. Resolves with the event.
     */
    static create(data) {
        return new Promise((resolve, reject) => {
            EventValidator.validatePreCreateData(data).then(() => {
                const newEvent = createEvent(data)
                EventValidator.validateCreateData(newEvent).then(() => {
                    newEvent.save((err, event) => {
                        if (err) { reject(err); }
                        resolve(event);
                    })
                })
                    .catch(errs => reject(errs));
            })
                .catch(errs => reject(errs));
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
     * Find all events of student.
     * @param {string} username The username of the student.
     * @returns {[Event]} Returns a promise. Resolves with an array of events belonging to the student.
     */
    static findWeeklyStudyEventsByUsername(username) {
        const today = new Date()
        const oneWeek = new Date()
        
        oneWeek.setDate(today.getDate() - 7)

        return new Promise((resolve, reject) => {
            Event.find({ username: username.toString(), type: 'study', startTime: { '$gte':oneWeek, '$lte':today } }).then((events) => {
                resolve(events);
            })
                .catch(err => reject(err))
        })
    }

    static findMonthlyStudyEventsByUsername(username) {
        const today = new Date()
        const oneMonth= new Date()
        
        oneMonth.setDate(today.getDate() - 30)

        return new Promise((resolve, reject) => {
            Event.find({ username: username.toString(), type: 'study', startTime: { '$gte':oneMonth, '$lte':today } }).then((events) => {
                resolve(events);
            })
                .catch(err => reject(err))
        })
    }

    static findWeeklyEventsByUsername(username) {
        const today = new Date()
        const oneWeek = new Date()
        
        oneWeek.setDate(today.getDate() - 7)

        return new Promise((resolve, reject) => {
            Event.find({ username: username.toString(), startTime: { '$gte':oneWeek, '$lte':today } }).then((events) => {
                resolve(events);
            })
                .catch(err => reject(err))
        })
    }

    static findMonthlyEventsByUsername(username) {
        const today = new Date()
        const oneMonth= new Date()
        
        oneMonth.setDate(today.getDate() - 30)

        return new Promise((resolve, reject) => {
            Event.find({ username: username.toString(), startTime: { '$gte':oneMonth, '$lte':today } }).then((events) => {
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
                .catch(err => {
                    reject(err)
                })
        })
    }

    /**
     * Find events by course subject and catalog
     * @param {string} username the username of the student.
     * @param {string} subject The subject of the course.
     * @param {string} catalog The catalog of the course.
     * @returns {[Event]} Returns a promise. Resolves with an array of events.
     */
    static findByCourse(username, subject, catalog) {
        return new Promise((resolve, reject) => {
            Event.find({ username: username.toString(), subject: subject.toString(), catalog: catalog.toString() }).then((event) => {
                resolve(event);
            })
                .catch(err => {
                    reject(err)
                })
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
     * @returns {number} Returns a promise. Resolves with the deleted event.
     */
    static deleteOne(eventID) {
        return new Promise((resolve, reject) => {
            Event.findOneAndDelete({ _id: eventID.toString() })
                .then((event) => {
                    resolve(event);
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
            EventValidator.validateCreateData(event).then(() => {
                event.save((err, event) => {
                    if (err) { reject(err); }
                    resolve(event);
                })
            })
                .catch(errs => reject(errs));
        })
    }
}