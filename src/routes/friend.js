const router = require('express').Router();
const Student = require('../models/student.model');
const StudentRepository = require('../repository/studentRepository')

// fetch the list of friends by email
router.route('/:email').get(async (req, res) => {
  const email = req.params.email.toString()
  StudentRepository.findOneByEmail(email)
    .then((student) => {
      res.json(student.friends).status(200)
    })
    .catch(err => res.status(400).json('Error: ' + err));
})

// send  a friend rerquest
router.route('/add').post(async (req, res) => {
  const username = req.body.username.toString();
  const friendUsername = req.body.friendUsername.toString()
  StudentRepository.findOneByUsername(username)
    .then((myProfile) => {
      StudentRepository.findOneByUsername(friendUsername).then((friendProfile) => {
        let friend = friendUsername;
        let me = username;

        let friendRequestsSent = myProfile.friendRequestsSent
        friendRequestsSent.push(friendUsername)

        let friendRequestsReceived = friendProfile.friendRequestsReceived
        friendRequestsReceived.push(username)

        StudentRepository.updateFriendRequestSent(me, friendRequestsSent)
          .then((student) => {
            StudentRepository.updateFriendRequestReceived(friend, friendRequestsReceived)
              .then((friend) => res.status(200).json(`Friend request sent.`))
              .catch(err => res.status(400).json('Error: ' + err));
          })
          .catch(err => res.status(400).json('Error: ' + err));


      })
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/answer').post(async (req, res) => {

  const username = req.body.username.toString();
  const friendUsername = req.body.friendUsername
  const answer = req.body.answer;

  Student.updateOne({ username: username },
    { $pull: { friendRequestsReceived: { $in: [friendUsername] } } })

});

// //upload a file to the database not yet complete
// router.route('/file').post(async(req, res) => {

//     let notes;
//     let r = (Math.random() + 1).toString(36).substring(7);
//     const roomID  = req.body.sID; 
//     const file =  req.body.file;
//     const username = req.body.username;
//      console.log(roomID)
//     const room = await StudyRoom.findOne({
//         sID:roomID,
//       });
//     let note = {
//          nID:r,
//          username:username,
//          file:file
//       }
//       console.log(room);
//       notes = room.courseNotes
//       notes.push(note)
//       StudyRoom.updateOne(
//         { sID: roomID },
//         { courseNotes: notes },
//         (err, docs) => {
//           if (err) {
//             console.log(err);
//           } else {
//             console.log('Updated Docs : ', docs);
//           }
//         },
//       );
// });

module.exports = router;