const Event = require('../models/event.model');

function createEvent(data) {
    const username = data.username;
    const eventHeader = data.eventHeader;
    const description = data.description;
    const link = data.link;
    const startDate = data.startDate;
    const endDate = data.endDate;
    const startTime = data.startTime;
    const endTime = data.endTime;
    const reccurence = data.reccurence;
    const color = data.color;
    return new Event({
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
}

function editEvent(data) {
    var event = {};
    if (data.eventHeader) {
        event.eventHeader = data.eventHeader;
    }
    if (data.description) {
        event.description = data.description;
    }
    if (data.link) {
        event.link = data.link;
    }
    if (data.startDate) {
        event.startDate = data.startDate;
    }
    if (data.endDate) {
        event.endDate = data.endDate;
    }
    if (data.startTime) {
        event.startTime = data.startTime;
    }
    if (data.endTime) {
        event.endTime = data.endTime;
    }
    if (data.reccurence) {
        event.reccurence = data.reccurence;
    }
    if (data.color) {
        event.color = data.color;
    }
    return event;
}

module.exports = {createEvent, editEvent};