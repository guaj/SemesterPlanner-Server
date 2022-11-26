const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ReccurencyTypes = {
    ONCE: 'once',
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
}

const eventSchema = new Schema({
    username: { type: String, required: true },
    eventID: { type: String, required: true, unique: true, sparse: true },
    eventHeader: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    recurrence: { type: String, enum: ReccurencyTypes, required: true },
    color: { type: String, required: true },
}, {
    timestamps: true,
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;