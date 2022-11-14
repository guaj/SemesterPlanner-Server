const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const courseNotesSchema = new Schema({
    courseNoteID:{ type:String, required:true, unique:true },
    studyRoomID :{ type:String, required:true },
    email:{type:String, required:true},
    filetype:{type:String, required:true},
    filename:{type:String, required:true},
    filesize:{type:String, required:true },
    file: { 
           data: Buffer,
           ContentType:String
          }
   

},{timestamps:true})


const courseNotes = mongoose.model('courseNotes', courseNotesSchema);

module.exports = courseNotes;