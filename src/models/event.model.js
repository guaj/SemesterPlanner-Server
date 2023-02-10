const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ReccurencyTypes = {
    ONCE: 'once',
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
}

const EventTypes = {
    // HOLIDAY: 'holiday',
    // EVENT: 'event',
    COURSE: 'course',
    WORKOUT:'workout',
    APPOINTMENT:'appointment',
    STUDY:'study'
}

const eventSchema = new Schema({
    username: { type: String, required: true },
    eventID: { type: String, unique: true, sparse: true },
    eventHeader: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    actualStartTime: { type: Date },
    actualEndTime: { type: Date },
    recurrence: { type: String, enum: ReccurencyTypes, required: true },
    color: { type: String, required: true },
    type: { type: String, enum:EventTypes, required: true },
    subject: { type: String },
    catalog: { type: String },
    data: { type: String }
}, {
    timestamps: true,
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;