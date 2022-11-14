const router = require('express').Router();
const StudyRoom = require('../models/studyRoom.model');
const Student = require('../models/student.model');
const courseNotes = require('../models/CourseNotes');
const {createStudyRoom, editStudyRoom} = require("../factory/RoomFactory");


router.route('/').put((req, res) => {
  StudyRoom.findOne({studyRoomID: req.body.studyRoomID.toString()})
  .then(room => {
      room = editStudyRoom(req.body)
      room.save()
          .then(() => res.json(`Room ${room.studyRoomID} updated`))
          .catch(err => res.status(400).json('Error: ' + err));
  })
  .catch(err => res.status(400).json('Error: ' + err));

})

//create a study room
router.route('/').post((req, res) => {
  const stdr = createStudyRoom(req.body);
  stdr.save()
      .then(() => res.json(`Study room ${stdr.studyRoomID} created`).status(200))
});

// fetch email by studyRoomID
/**
 * Study room info route
 * @param studyRoomID: ID  of the study room
 * @return room: the room matching the study room ID
 */
router.get('/fetch/:studyRoomID', async (req, res) => {
  console.log(req.params.studyRoomID)
  const studyRoomID= req.params.studyRoomID.toString()
  const rooms = await StudyRoom.findOne({
    studyRoomID: studyRoomID
  });
  //var io = req.app.get('socketio');
  //io.emit('message', 'Hello!');
res.json(rooms).status(200);
})


// add a friend to study room
router.route('/add').post(async(req, res)=>{
  email  = req.body.email.toString()
  ID = req.body.studyRoomID.toString()
  const room = await StudyRoom.findOne( { studyRoomID: ID })
  var participants=room.participants;
  if (!participants.includes(email)) {
    participants.push(email);
  }
  else {
    res.json("Student is already present in studyroom").status(200);
    return;
  }

  await StudyRoom.updateOne(
    { studyRoomID: ID }, 
    { participants: participants },
  );
  const student = await Student.findOne( { email: email })
  var studyRooms=student.StudyRooms;
  studyRooms.push(ID);

  Student.updateOne(
    { email: email }, 
    { StudyRooms: studyRooms },
  ).then(() => res.json(email + " added to studyroom").status(200));
})

router.route('/remove').post(async(req, res)=>{
  email  = req.body.email.toString()
  ID = req.body.studyRoomID.toString()

  const room = await StudyRoom.findOne( { studyRoomID: ID })
  var participants = room.participants
  const participantIndex = participants.indexOf(email);
  if (participantIndex > -1) {
    participants.splice(participantIndex, 1);
  }
  else {
    res.json('User not found').status(404);
    return;
  }
  await StudyRoom.updateOne(
    { studyRoomID: ID },
    { participants: participants },
  );
  const student = await Student.findOne( { email: email })
  var studyRooms = student.StudyRooms;
  const roomIndex = studyRooms.indexOf(ID);
  if (roomIndex > -1) {
    studyRooms.splice(roomIndex, 1);
    await Student.updateOne(
      { email: email },
      { StudyRooms: studyRooms },
    ).then(() => res.json(email + " removed to studyroom").status(200));
  }
  else {
    res.json('Room not found').status(404);
    return;
  }

})

/**
 * Email route
 * @param email: email of the student
 * @return rooms: that the student is part of
*/
router.route('/:email').get(async(req, res) => {
  const email= req.params.email.toString()
  const rooms = await StudyRoom.find({
    participants: {"$in": [email]}
  });
  res.json(rooms).status(200)
  })


// delete  the study room you need the username of the owner and the roomID
router.route('/delete').post(async(req, res) => {
  console.log(req.body)
  const email= req.body.email.toString()
  const roomID= req.body.studyRoomID.toString()
  const room = await StudyRoom.deleteOne({
        studyRoomID:roomID,
        owner:email
      });
       res.send("deleted room "+ roomID.toString())
  })

// upload a file to the database  file needs to be transformed to a buffer be being sent
// the user should send he ID of the study room, 
router.post('/file', (req, res) => {
console.log(req.body);
  let r = (Math.random() + 1).toString(36).substring(7);
        const newImage= new courseNotes({
         courseNoteID:r,
         studyRoomID:req.body.studyRoomID,
         email:req.body.email,
         filetype:req.body.type,
         filename:req.body.name,
         filesize:req.body.size,
         file:{
          data: req.body.file,
          contentType:req.body.type
         }

        })

        newImage.save().then(()=>res.send("successfuly uploaded"))
    
});

// get file BY courseNoteID
router.route('/file/:courseNoteID').get(async(req, res) => {
    const courseNoteID= req.params.courseNoteID.toString()
    const note =  await courseNotes.find({
    courseNoteID:courseNoteID,
})
res.json(note).status(200);
})

router.route('/file/:courseNoteID').delete(async(req, res) => {
  const noteID = req.params.courseNoteID
  await courseNotes.deleteOne({
    courseNoteID:noteID
  })
res.json("deleted file :" + noteID).status(200);
})

// route to fetch all the file  by studyRoomID
router.route('/files/:studyRoomID').get(async(req, res) => {
  const studyRoomID= req.params.studyRoomID.toString()
  const notes =  await courseNotes.find({
    studyRoomID:studyRoomID,
  })
  res.json(notes).status(200);
})


module.exports = router;