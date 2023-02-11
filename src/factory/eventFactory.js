const Event = require('../models/event.model');
const { v4: uuidv4 } = require('uuid');

function createEvent(data) {
    const eventID = uuidv4();
    const username = data.username;
    let eventHeader = "Unnamed Event"; // default title
    if (data.eventHeader) {
        eventHeader = data.eventHeader;
    }
    let description = "An event."; // default description
    if (data.description) {
        description = data.description;
    }
    const link = data.link;
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const startTime = new Date(data.startTime);
    const endTime = new Date(data.endTime);
    const actualStartTime = new Date(data.actualStartTime);
    const actualEndTime = new Date(data.actualEndTime);
    const recurrence = data.recurrence;
    let color = '#808080'; // default gray color
    if (data.color) {
        color = data.color;
    }
    let type = 'event'
    if (data.type) {
        type = data.type
    }
    const subject = data.subject;
    const catalog = data.catalog;
    const studyHoursConfirmed = false;
    return new Event({
        eventID,
        username,
        eventHeader,
        description,
        link,
        startDate,
        endDate,
        startTime,
        endTime,
        actualStartTime,
        actualEndTime,
        recurrence: recurrence,
        color,
        type,
        subject,
        catalog,
        studyHoursConfirmed
    })
}

module.exports = { createEvent };