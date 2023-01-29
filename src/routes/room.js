const router = require('express').Router();
const CourseNotesRepository = require("../repository/courseNotesRepository")
const StudyRoomRepository = require('../repository/studyRoomRepository');
const StudentRepository = require('../repository/studentRepository');
const StudyRoomValidator = require('../validator/roomValidator')
const MessageRepository = require('../repository/messageRepository')


router.route('/').put((req, res) => {
  StudyRoomRepository.findOne(req.body.studyRoomID)
    .then((room) => {
      if (req.body.owner) {
        room.owner = req.body.owner;
      }
      if (req.body.color) {
        room.color = req.body.color;
      }
      if (req.body.description) {
        room.description = req.body.description;
      }
      if (req.body.title) {
        room.title = req.body.title;
      }
      if (req.body.avatarText) {
        room.avatar = req.body.avatarText;
      }
      if (req.body.participants) {
        room.participants = req.body.participants;
      }
      StudyRoomRepository.updateOne(room)
        .then((room) => res.json(`Room ${room.studyRoomID} updated`))
        .catch(err => res.status(400).json(err));
    })
    .catch(err => res.status(400).json(err));

})

//create a study room
router.route('/').post((req, res) => {
  StudyRoomRepository.create(req.body)
    .then((room) => {
      StudentRepository.findOneByEmail(req.body.owner)
        .then((student) => {
          let studyRooms = student.studyRooms;
          studyRooms.push(room.studyRoomID);
          StudentRepository.updateStudyRooms(req.body.owner, studyRooms)
            .then(() => {
              res.json(room).status(200)
            })
            .catch(err => res.status(400).json(err));
        })
        .catch(err => res.status(400).json(err));
    })

    .catch(err => res.status(400).json(err));
});

/**
 * Study room info route
 * @param studyRoomID: ID  of the study room
 * @return room: the room matching the study room ID
 */
router.get('/fetch/:studyRoomID', async (req, res) => {
  const studyRoomID = req.params.studyRoomID.toString()
  StudyRoomRepository.findOne(studyRoomID)
    .then((room) => res.json(room).status(200))
    .catch(err => res.status(400).json(err));

})


// add a friend to study room
router.route('/add').post(async (req, res) => {
  const email = req.body.email.toString()
  const ID = req.body.studyRoomID.toString()
  StudyRoomValidator.validateAddingStudent(email, ID).then(() => {
    StudyRoomRepository.findOne(ID)
      .then((room) => {
        let participants = room.participants;
        participants.push(email);
        StudyRoomRepository.updateParticipants(ID, participants)
          .then((room) => {
            StudentRepository.findOneByEmail(email)
              .then((student) => {
                let studyRooms = student.studyRooms;
                studyRooms.push(ID);
                StudentRepository.updateStudyRooms(email, studyRooms)
                  .then(() => res.json(email + " added to studyroom").status(200))
                  .catch(err => res.status(400).json(err));
              })
              .catch(err => res.status(400).json(err));
          })
          .catch(err => res.status(400).json(err));
      })
  })
    .catch(err => res.status(400).json(err));

})

router.route('/remove').post(async (req, res) => {
  const email = req.body.email.toString()
  const ID = req.body.studyRoomID.toString()

  StudyRoomValidator.validateDeletingStudent(email, ID).then(() => {
    StudyRoomRepository.findOne(ID)
      .then((room) => {
        let participants = room.participants
        const participantIndex = participants.indexOf(email);
        participants.splice(participantIndex, 1);
        StudyRoomRepository.updateParticipants(ID, participants)
          .then((room) => {
            StudentRepository.findOneByEmail(email)
              .then((student) => {
                let studyRooms = student.studyRooms;
                const roomIndex = studyRooms.indexOf(ID);
                studyRooms.splice(roomIndex, 1);
                StudentRepository.updateStudyRooms(email, studyRooms)
                  .then(() => res.json(email + " removed from studyroom").status(200))
                  .catch(err => res.status(400).json(err));
              })
              .catch(err => res.status(400).json(err));
          })
          .catch(err => res.status(400).json(err));
      })
      .catch(err => res.status(400).json(err));
  })
    .catch(err => res.status(400).json(err));
})

/**
 * Email route
 * @param email: email of the student
 * @return rooms: that the student is part of
*/
router.route('/:email').get(async (req, res) => {
  const email = req.params.email.toString()
  StudyRoomRepository.findAllbyStudentEmail(email)
    .then((rooms) => res.json(rooms).status(200))
    .catch(err => res.status(400).json(err));
})

// delete studyRoom by ID
router.route('/').delete(async (req, res) => {

  const roomID = req.body.studyRoomID.toString()
  StudyRoomValidator.validateDelete(roomID).then(() => {
    StudyRoomRepository.findOne(roomID).then(async (room) => {
      let participants = room.participants;
      // Removes the room from its list of participants before deleting the room
      for (let participant of participants) {
        let student = await StudentRepository.findOneByEmail(participant)
        let studyRooms = student.studyRooms;
        const roomIndex = studyRooms.indexOf(roomID);
        studyRooms.splice(roomIndex, 1);

        await StudentRepository.updateStudyRooms(participant, studyRooms)
          .catch(err => res.status(400).json(err));
      }

      // Deletes associated messages
      await MessageRepository.deleteAllFromRoomID(roomID).catch(err => res.status(400).json(err));

      //Deletes associated courseNotes
      await CourseNotesRepository.deleteAllFromRoomID(roomID).catch(err => res.status(400).json(err));

      StudyRoomRepository.deleteOne(roomID)
        .then(status => {
          res.status(200).json("deleted " + status + " room")
        })
        .catch(err => res.status(400).json(err));
    })
  })
    .catch(err => res.status(400).json(err));
})


// upload a file to the database  file needs to be transformed to a buffer be being sent
// the user should send the ID of the study room, 
router.post('/file', (req, res) => {
  CourseNotesRepository.create(req.body)
    .then(() => res.send("successfuly uploaded"))
    .catch(err => res.status(400).json(err));
});

// get file BY courseNoteID
router.route('/file/:courseNotesID').get(async (req, res) => {
  CourseNotesRepository.findOne(req.params.courseNotesID)
    .then(note => res.json(note).status(200))
    .catch(err => res.status(400).json(err));
})

router.route('/file/:courseNotesID').delete(async (req, res) => {
  CourseNotesRepository.deleteOne(req.params.courseNotesID)
    .then(status => res.json("deleted " + status + " file").status(200))
    .catch(err => res.status(400).json(err));
})

// route to fetch all the file  by studyRoomID
router.route('/files/:studyRoomID').get(async (req, res) => {
  CourseNotesRepository.findAllbyStudyRoomID(req.params.studyRoomID)
    .then(notes => res.json(notes).status(200))
    .catch(err => res.status(400).json(err));
})


module.exports = router;