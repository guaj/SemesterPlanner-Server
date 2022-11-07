const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const calendarSchema = new Schema({
    cID: { type: String, required: true, unique: true },
    customizations: [{
                     category: String,
                     color : String
                     }]
    
    
}, {
    timestamps: true,
});

const calendar = mongoose.model('Calendar', calendarSchema);

module.exports = calendar;
