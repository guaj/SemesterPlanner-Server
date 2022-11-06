const router = require('express').Router();
const Student = require('../models/student.model');


// fetch the list of friends by email
router.route('/:email').get(async(req, res)=>{
const email= req.params.email.toString()
const Profil = await Student.findOne({
    email:email
  });

  res.json(Profil.friends).status(200)
})



// send  a friend rerquest
router.route('/add').post(async(req, res) => {

  const username = req.body.username.toString();
  const friendUsername= req.body.friendUsername.toString()

    

    const myProfil = await Student.findOne({
        username:username,
      });

    const friendProfil = await Student.findOne({
        username:friendUsername,
      });

      let friend = friendUsername
      let me = username
      
   let friendRequestsSent= myProfil.friendRequestsSent
   friendRequestsSent.push(friendUsername)



   let friendRequestsReceived=friendProfil.friendRequestsReceived
   friendRequestsReceived.push(username)

      Student.updateOne(
        { username: me },
        { friendRequestsSent:friendRequestsSent },
        (err, docs) => {
          if (err) {
            console.log(err);
          } else {
            console.log('Updated Docs : ', docs);
          }
        },
      );2
       
      Student.updateOne(
        { username: friend },
        { friendRequestsReceived:friendRequestsReceived },
        (err, docs) => {
          if (err) {
            console.log(err);
          } else {
            console.log('Updated Docs : ', docs);
          }
        },
      );

      

    
});




router.route('/answer').post(async(req, res) => {

  const username = req.body.username.toString();
  const friendUsername= req.body.friendUsername
  const answer = req.body.answer;


 console.log(username)
 console.log(friendUsername)

    Student.updateOne({ username: username }, 
      { $pull: { friendRequestsReceived: { $in: [friendUsername] }}})
 


    
      

    
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