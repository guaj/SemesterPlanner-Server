const Event = require('../models/event.model');
const { createEvent } = require("../factory/eventFactory");
const EventValidator = require('../validator/eventValidator')
const {cloneDeep} = require("lodash");
const StudentRepository = require("./studentRepository");

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
     * Find all events of student based on time and type filter.
     * @param {string} username The username of the student.
     * @param {int} duration The duration in days to filter by. This filters events starting today and going back 'duration' number of days, Default = 7
     * @param {string} type The type of events to include in the results. Can either be "study" or "all". Default = "study"
     * @returns {[Event]} Returns a promise. Resolves with an array of events belonging to the student.
     */
    static durationTypeUserEventFilter(username, duration=7, type='study'){
        const today = new Date();
        const oneWeek = new Date();

        oneWeek.setDate(today.getDate() - duration);

        return this.findAllbyStudentUsername(username).then((events) => {
            const expandedEvents = this.expandEventList(events)

            let filteredEvents;
            if (type === 'study')
                filteredEvents = expandedEvents.filter(e => e.startDate >= oneWeek && e.startDate <= today && e.type === 'study')
            else
                filteredEvents = expandedEvents.filter(e => e.startDate >= oneWeek && e.startDate <= today)
            return filteredEvents
        })
    }

    /**
     * method that takes a 'condensed' list of events fetched from the database and generates an expanded list taking event
     * recurrence into account
     * @param {Array} condensedEventList, array of events
     * @returns {*}, returns a copy of the original condensed array after expanding it
     */
    static expandEventList(condensedEventList) {
        let expandedEvents = cloneDeep(condensedEventList);
        condensedEventList.forEach((event) => {
            const startDate = new Date(event.startDate);
            startDate.setHours(0, 0, 0, 0); // required to ignore time on date comparisons
            const endDate = new Date(event.endDate);
            endDate.setHours(0, 0, 0, 0); // required to ignore time on date comparisons
            if (event.recurrence === 'daily') {
                this.expandEvent(expandedEvents, event, 1, event.recurrence, startDate, endDate)
            } else if (event.recurrence === 'weekly') {
                this.expandEvent(expandedEvents, event, 7, event.recurrence, startDate, endDate)
            } else if (event.recurrence === 'monthly') {
                this.expandEvent(expandedEvents, event, 1, event.recurrence, startDate, endDate)
            }
        })

        return expandedEvents;
    };

    /**
     * method that takes a single event, expands it, and adds it to specified array
     * @param expandedEventsList array of events into which the specified event's expansion will be added to
     * @param event event for which the expansion is to be applied
     * @param dateIncrement an integer for the increment required to the date; value are 1 (daily or monthly), 7 (weekly); other values may lead to unexpected behaviour
     * @param incrementType a string of value 'daily', 'weekly', or 'monthly' depending on the type of increment specified in the 'dateIncrement' parameter
     * @param startDate initial start date of the event to be expanded
     * @param endDate event end date at which the expansion ends
     */
    static expandEvent(expandedEventsList, event, dateIncrement, incrementType, startDate, endDate) {
        do {
            if (incrementType === 'monthly')
                startDate.setMonth(startDate.getMonth() + dateIncrement);
            else if (incrementType === 'daily' || incrementType === 'weekly')
                startDate.setDate(startDate.getDate() + dateIncrement);
            else
                break;

            if (startDate > endDate) // loop needs to be terminated this way to satisfy sonarcloud's expectation
                break;

            const temp = cloneDeep(event);
            temp.startDate = cloneDeep(startDate);
            expandedEventsList.push(temp);
        } while (true)
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

    static async #updateCourseList(event){
        if (event.type === 'course' || event.type === 'study' || event.type === 'exam') {
            let courses = await EventRepository.findByCourse(event.username, event.subject, event.catalog);
            if (courses.length === 0) {
                let student = await StudentRepository.findOneByUsername(event.username);
                let studentCourses = student.courses;
                let index = studentCourses.findIndex(function (course) {
                    return (course.subject === event.subject && course.catalog === event.catalog);
                });
                studentCourses.splice(index, 1);
                await StudentRepository.updateCourses(event.username, studentCourses);
            }
        }
    }

    /**
     * Delete one event by its eventID.
     * @param {string} eventID The eventID of the event.
     * @returns {number} Returns a promise. Resolves with the deleted event.
     */
    static deleteOne(eventID) {
        return new Promise((resolve, reject) => {
            Event.findOneAndDelete({ _id: eventID.toString() })
                .then(async (event) => {
                    await EventRepository.#updateCourseList(event);
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
                this.findOne(event.eventID).then((originalEvent) => {
                    event.save(async (err, updatedEvent) => {
                        if (err) {
                            reject(err);
                        }
                        await EventRepository.#updateCourseList(originalEvent);
                        resolve(updatedEvent);
                    })
                })
            })
                .catch(errs => reject(errs));
        })
    }
}