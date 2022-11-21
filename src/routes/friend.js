const router = require('express').Router();
const Student = require('../models/student.model');
const StudentRepository = require('../repository/studentRepository')
const FriendRequest = require('../models/friendRequest.model');
const createFriendRequest = require('../factory/friendRequestFactory');

/**
 * @author: Jasmin Guay
 * Endpoint to send a friend request.
 * @param senderEmail (string) : email of the sender
 * @param receiverEmail (string) : email of the students to be added
 * @return _id (string) : id of the friend request created.
 */
router.route('/add').post(async (req, res) => {
  const senderEmail = req.body.senderEmail;
  const receiverEmail = req.body.receiverEmail;

  if (!isInFriendList(senderEmail, receiverEmail)) {
    const newFriendRequest = createFriendRequest({senderEmail, receiverEmail});
    FriendRequest.findOne({senderEmail, receiverEmail}).then((existingRequest) => {
      if (existingRequest == null) {
        newFriendRequest.save()
            .then((result) => {
              res.json(result._id).status(200);
            }).catch((err) => {
          res.json(err).status(404);
        })
      } else {
        res.json(`A request was already sent to user [${receiverEmail}]`).status(200);
      }
    })
  } else {
    res.json(`User [${receiverEmail}] - is already in your friend list`).status(100);
  }

});

function isInFriendList(student1, student2) {
  let inFriendList = false;
  Student.findOne({ email : student1}).then((res) => {
    inFriendList = res.friends.some((friend) => friend === student2);
  });

  return inFriendList;
}

/**
 * @author: Jasmin Guay
 * Endpoint to fetch the friend list of a specific student
 * @param email (string) : email of the student to retrieve the list.
 * @return friends (string[]) : a list of friends (usernames).
 */
router.route('/:email').get(async (req, res) => {
  const email = req.params.email.toString();

  StudentRepository.findOneByEmail(email)
      .then((student) => {
        res.json(student.friends).status(200)
      })
      .catch(err => res.status(400).json('Error: ' + err));
})

/**
 * @author: Jasmin Guay
 * Endpoint to update a student friend list.
 * @params email (string) email of the student to be updated
 * @params friends (string[]) list of updated friend list.
 * @return the update friend list.
 */
router.route('/updateFriendList').post( async (req,res) => {
    const email = req.body.email;
    const updatedFriendList = req.body.friends;

    StudentRepository.updateFriendList(email,updatedFriendList)
        .then((student) => { res.json(student.friends).status(200) })
        .catch((err) => { res.json(`Error happened in updateFriendList - ${err}`).status(404) })
})


/**
 * @author: Jasmin Guay
 * Endpoint to answer a friend request.
 * @param requestId (string) id of the request.
 * @param answer ("accepted" | "declined") answer to the friend request.
 * @return studentUsername (string) username of the student added to the friend list if the request was accepted, null otherwise.
 */
router.route('/answerFriendRequest').post(async (req, res) => {
  const requestId = req.body.requestId;
  const request = await FriendRequest.findOne({_id: requestId});

  if (request == null) {
    res.json(`No request found with id [${requestId}`).status(404);
  } else {
    if (req.body.answer === "accepted") {
      await addToFriendLists(request.senderEmail, request.receiverEmail);
      res.json(request.receiverEmail).status(200);
    } else {
      res.status(200)
    }
    await FriendRequest.deleteOne({_id: requestId});
  }
});

/**
 * Helper to add 2 students in both their friend lists.
 */
async function addToFriendLists(student1, student2) {
  await addToFriendList(student1, student2);
  await addToFriendList(student2, student1);
}

/**
 * Helper function to add a student to another one friend list.
 */
async function addToFriendList(email1, email2) {
  const student = await Student.findOne({email: email1});
  student.friends.push(email2);
  student.save();
  // 2DO : need to add middleware to throw custom errors.
}

/**
 * @author: Jasmin Guay
 * Endpoint to display all incoming requests.
 * @param email (string) : email of the student to fetch incoming requests
 * @return friendRequests (friendRequest[]) : list of friend requests sent to the specified student.
 */
router.route("/incoming-requests/:email").get( async (req, res) => {
  const email = req.params.email.toString();

  FriendRequest.find({
    receiverEmail: email
  }).then((requests) => {
    res.json(requests).status(200);
  }).catch((err) => {
    res.json(`Cannot fetch incoming requests for [${email}] - ${err}`);
  })
})

/**
 * @author: Jasmin Guay
 * Endpoint to display all outgoing requests.
 * @param email (string) : email of the student to fetch outgoing requests
 * @return friendRequests (friendRequest[]) : list of friend requests received by the specified student.
 */
router.route("/outgoing-requests/:email").get( async (req, res) => {
  const email = req.params.email.toString();

  FriendRequest.find({
    senderEmail: email
  }).then((requests) => {
    res.json(requests).status(200);
  }).catch((err) => {
    res.json(`Cannot fetch outgoing requests for [${email}] - ${err}`);
  })
})

/**
 * @author: Jasmin Guay
 * Endpoint to delete an outgoing request
 * @param requestId (string) : id of the request to be deleted
 * @return friendRequests (friendRequest[]) : list of friend requests received by the specified student.
 */
router.route("/cancel-request").delete( async (req, res) => {
  const requestId = req.body.requestId;

  FriendRequest.findOneAndDelete({
    _id: requestId
  }).then((requests) => {
    res.json(requests).status(200);
  }).catch((err) => {
    res.json(`Cannot delete request with id [${requestId}] - ${err}`);
  })
})

/**
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

module.exports = router;