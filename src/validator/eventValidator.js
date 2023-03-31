const OpenDataCourseRepository = require("../repository/conUOpenDataCourseRepository");

module.exports = class EventValidator {

    /**
     * Regex hex color validator
     * @param {*} color the color in hex (#FFFFFF)
     * @returns true/false
     */
    static validateColor = (color) => {
        return String(color)
            .match(
                /^#(?:[0-9a-fA-F]{3}){1,2}$/ig
            );
    };

    /**
     * Validator for event creation.
     * @param {Event} event event object.
     * @returns {[string]} Returns a promise. Resolves with nothing, rejects with array of errors.
     */
    static async validateCreateData(event) {
            let res = { 'errors': [] };

            if (event.username === undefined || event.username === "") {
                res.errors.push('Missing username');
            }
            if (event.eventHeader === undefined || event.eventHeader === "") {
                res.errors.push('Missing eventHeader');
            }
            // if (event.recurrence === undefined || event.recurrence === "") {
            //     res.errors.push('Empty recurrence');
            // }
            // else {
            //     if (!['once', 'daily', 'weekly', 'monthly'].includes(event.recurrence)) {
            //         res.errors.push('Invalid recurrence (once, daily, weekly, monthly)')
            //     }
            // }
            EventValidator.#eventRecurrenceValidator(event, res);
            if (event.type === undefined || event.type === "") {
                res.errors.push('Empty type');
            }
            else {
                await EventValidator.#eventTypeValidator(event, res)
            }
            if (!this.validateColor(event.color)) {
                res.errors.push('Invalid hex color');
            }
            if (event.eventHeader.length > 128) {
                res.errors.push('event header length exceeds 128 characters');
            }
            if (event.description.length > 2048) {
                res.errors.push('event description length exceeds 2048 characters');
            }
            if (event.studyHoursConfirmed !== true && event.studyHoursConfirmed !== false)
                res.errors.push('Invalid value for parameter studyHoursConfirmed: value must be boolean')
            if (res.errors[0]) {
                throw res;
            }
    }

    static #eventRecurrenceValidator(event, res){
        if (event.recurrence === undefined || event.recurrence === "") {
            res.errors.push('Empty recurrence');
        }
        else {
            if (!['once', 'daily', 'weekly', 'monthly'].includes(event.recurrence)) {
                res.errors.push('Invalid recurrence (once, daily, weekly, monthly)')
            }
        }
    }

    static async #eventTypeValidator(event, res){
        if (!['holiday', 'event', 'course', 'study', 'appointment', 'workout', 'exam'].includes(event.type)) {
            res.errors.push('Invalid type (holiday, event, course)')
        }
        else {
            if (event.type === 'course' || event.type === 'study' || event.type === 'exam') {
                if (!(await OpenDataCourseRepository.findByCourseCodeAndNumber(event.subject, event.catalog))) {
                    res.errors.push('Invalid course code or number')
                } else {
                    event.subject = event.subject.toUpperCase();
                }
            } else {
                event.subject = "";
                event.catalog = "";
            }
        }
    }

    /**
     * Validator for event creation.
     * @param {*} data data parameters.
     * @returns {[string]} Returns a promise. Resolves with nothing, rejects with array of errors.
     */
    static async validatePreCreateData(data) {
            let res = { 'errors': [] };
            if (data.startDate === undefined || data.startDate === "") {
                res.errors.push('Missing startDate');
            }
            if (data.endDate === undefined || data.endDate === "") {
                res.errors.push('Missing endDate');
            }
            if (data.startTime === undefined || data.startTime === "") {
                res.errors.push('Missing startTime');
            }
            if (data.endTime === undefined || data.endTime === "") {
                res.errors.push('Missing endTime');
            }

            // TO DO: validate times

            if (res.errors[0]) {
                throw res;
            }
    }
}