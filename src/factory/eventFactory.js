const Event = require('../models/event.model');
const { v4: uuidv4 } = require('uuid');

function createEvent(data) {
    const eventID = uuidv4();
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
        eventID,
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

module.exports = { createEvent };