const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Colors = {
    Red: 'red',
    Blue: 'blue',
    Green: 'green',
    Yellow: 'yellow',
}

const ReccurencyTypes = {
    ONCE: 'once',
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
}

const eventSchema = new Schema({
    eventHeader: { type: String, required: true },
    description: { type: String },
    link: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    reccurence: { type: String, enum: ReccurencyTypes, required: true },
    color: { type: String, enum: Colors },
}, {
    timestamps: true,
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;