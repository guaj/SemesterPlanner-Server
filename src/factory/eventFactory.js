const Event = require('../models/event.model');

function createEvent(data) {
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