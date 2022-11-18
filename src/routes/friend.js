const router = require('express').Router();
const Student = require('../models/student.model');

/**
 * Fetch the list of friends by email
 */
router.route('/:email').get(async (req, res) => {
  const email = req.params.email.toString()
  const Profile = await Student.findOne({
    email: email
  });
  res.json(Profile.friends).status(200)
})

/**
 * Fetch the list of friends by username
 */
router.route('/username/:username').get(async (req, res) => {
  const userTemp = req.params.username.toString()
  const Profile = await Student.findOne({
    username: userTemp
  });
  res.json(Profile.friends).status(200)
})


/**
 * Send a friend request
 * Return: confirmation text
 */
router.route('/add').post(async (req, res) => {
  const username = req.body.username.toString();
  const friendUsername = req.body.friendUsername.toString()
  const myProfile = await Student.findOne({
    username: username,
  });

  const friendProfile = await Student.findOne({
    username: friendUsername,
  });

  //Rename for ease of use
  let friend = friendUsername
  let me = username

  // Create copies add new requests
  let friendRequestsSent = myProfile.friendRequestsSent
  friendRequestsSent.push(friendUsername)

  let friendRequestsReceived = friendProfile.friendRequestsReceived
  friendRequestsReceived.push(username)

  //Update original lists
  Student.updateOne(
    { username: me },
    { friendRequestsSent: friendRequestsSent },
    (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Updated Docs : ', docs);
      }
    },
  );

  Student.updateOne(
    { username: friend },
    { friendRequestsReceived: friendRequestsReceived },
    (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Updated Docs : ', docs);
      }
    },
  );

  res.json("Friend request sent to " + friend ).status(200)
});

/**
 * answer friend request
 */
router.route('/answerFriendRequest').post(async (req, res) => {

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


/**TODO:
 * delete friend with email
 * (front end:
 * delete request
 * http://localhost:5000/friend/admin2@admin.ca/admin3@admin.ca)
 */
router.route('/:email/:friendEmail').delete(async (req, res) => {
  const emailTemp = req.params.email.toString() //params is : in url
  const friendEmailTemp = req.params.friendEmail.toString()
  const Profile = await Student.findOne({
    email: emailTemp
  });
  //local change
  friendList = Profile.friends
  friendIndex = friendList.indexOf(friendEmailTemp)
  //console.log(friendIndex)
 // console.log(friendList)
  friendList.splice(friendIndex,1); // 0 means will not put a new element inside, 2nd param deletes old one
  //console.log(friendList)
  //update on mongoDB
  Student.updateOne(
      { email: emailTemp },
      { friends: friendList },
      (err, docs) => {
        if (err) {
          console.log(err);
        } else {
          console.log('Updated Docs : ', docs);
        }
      },
  );
  res.json(emailTemp+ " friend " + friendEmailTemp+ " has been deleted.").status(200)
})

/**TODO:
 * display friend request received
 */

/**TODO:
 * display friend request sent
 */

/**TODO:
 * Confirm approved friend request (update other friend)
 */

/**TODO:
 * Reject friend request (update other friend)
 */

/**TODO:
 * display friend request sent
 */

/**TODO:
 * Cancel personal request sent (update friend)
 * (like deleting a message in a chat)
 */


module.exports = router;