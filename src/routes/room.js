const router = require('express').Router();
const StudyRoom = require('../models/studyRoom.model');
const Student = require('../models/student.model');
const { createStudyRoom } = require("../factory/roomFactory");
const CourseNotesRepository = require("../repository/courseNotesRepository")


router.route('/').put((req, res) => {
  StudyRoom.findOne({ studyRoomID: req.body.studyRoomID.toString() })
    .then((room) => {
      if (data.owner) {
        room.owner = data.owner;
      }
      if (data.color) {
        room.color = data.color;
      }
      if (data.description) {
        room.description = data.description;
      }
      if (data.title) {
        room.title = data.title;
      }
      if (data.avatarText) {
        room.avatar = data.avatarText;
      }
      if (data.participants) {
        room.participants = data.participants;
      }
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
  const studyRoomID = req.params.studyRoomID.toString()
  const rooms = await StudyRoom.findOne({
    studyRoomID: studyRoomID
  });
  res.json(rooms).status(200);
})


// add a friend to study room
router.route('/add').post(async (req, res) => {
  const email = req.body.email.toString()
  const ID = req.body.studyRoomID.toString()
  const room = await StudyRoom.findOne({ studyRoomID: ID })
  var participants = room.participants;
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
  const student = await Student.findOne({ email: email })
  var studyRooms = student.StudyRooms;
  studyRooms.push(ID);

  Student.updateOne(
    { email: email },
    { StudyRooms: studyRooms },
  ).then(() => res.json(email + " added to studyroom").status(200));
})

router.route('/remove').post(async (req, res) => {
  const email = req.body.email.toString()
  const ID = req.body.studyRoomID.toString()

  const room = await StudyRoom.findOne({ studyRoomID: ID })
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
  const student = await Student.findOne({ email: email })
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
router.route('/:email').get(async (req, res) => {
  const email = req.params.email.toString()
  const rooms = await StudyRoom.find({
    participants: { "$in": [email] }
  });
  res.json(rooms).status(200)
})

// delete  the study room you need the username of the owner and the roomID
router.route('/delete').post(async (req, res) => {
  console.log(req.body)
  const email = req.body.email.toString()
  const roomID = req.body.studyRoomID.toString()
  const room = await StudyRoom.deleteOne({
    studyRoomID: roomID,
    owner: email
  });
  res.send("deleted room " + roomID.toString())
})


// upload a file to the database  file needs to be transformed to a buffer be being sent
// the user should send the ID of the study room, 
router.post('/file', (req, res) => {
  CourseNotesRepository.create(req.body)
    .then(() => res.send("successfuly uploaded"))
    .catch(err => res.status(400).json('Error: ' + err));
});

// get file BY courseNoteID
router.route('/file/:courseNotesID').get(async (req, res) => {
  CourseNotesRepository.findOne(req.body.courseNotesID)
    .then(note => res.json(note).status(200))
    .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/file/:courseNotesID').delete(async (req, res) => {
  CourseNotesRepository.deleteOne(req.params.courseNotesID)
    .then(status => res.json("deleted " + status + " file").status(200))
    .catch(err => res.status(400).json('Error: ' + err));
})

// route to fetch all the file  by studyRoomID
router.route('/files/:studyRoomID').get(async (req, res) => {
  CourseNotesRepository.findAllbyStudyRoomID(req.params.studyRoomID)
    .then(notes => res.json(notes).status(200))
    .catch(err => res.status(400).json('Error: ' + err));
})


module.exports = router;