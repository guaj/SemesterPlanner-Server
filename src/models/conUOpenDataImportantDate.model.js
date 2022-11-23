const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const openDataImportantDateSchema = new Schema({
    date: {type: Date, required: true},
    description: {type: String, required: true}
}, {
    timestamps: false,
});

const OpenDataImportantDate = mongoose.model('OpenDataImportantDate', openDataImportantDateSchema);

module.exports = OpenDataImportantDate;