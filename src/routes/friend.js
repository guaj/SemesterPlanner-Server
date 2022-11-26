const router = require('express').Router();
const Student = require('../models/student.model');
const StudentRepository = require('../repository/studentRepository')
const FriendRequest = require('../models/friendRequest.model');
const createFriendRequest = require('../factory/friendRequestFactory');
const FriendRequestRepository = require('../repository/friendRequestRepository');

/**
 * @author: Jasmin Guay
 * Endpoint to send a friend request.
 * @param {string} senderEmail : email of the sender
 * @param {string} receiverEmail : email of the students to be added
 * @return {string} _id  : id of the friend request created.
 */
router.route('/add').post(async (req, res) => {
  const senderEmail = req.body.senderEmail.toString();
  const receiverEmail = req.body.receiverEmail.toString();

  if (!await StudentRepository.isInFriendList(senderEmail, receiverEmail)) {
    const newFriendRequest = createFriendRequest({senderEmail, receiverEmail});
    FriendRequestRepository.save({senderEmail, receiverEmail})
        .then((res) => res.json(result._id).status(200))
        .catch((err) => res.json(`Unable to add [${receiverEmail}] in your friend list - ${err}`).status(404))
  }
});

/**
 * @author: Jasmin Guay
 * Endpoint to fetch the friend list of a specific student
 * @param {string} email : email of the student to retrieve the list.
 * @return {[string]} friends : a list of friends (usernames).
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
 * Endpoint to update a student friend list
 * @param {string} email : email of the student to be updated
 * @param {string} friends : list of updated friend list.
 * @return {[string]} the update friend list.
 */
router.route('/updateFriendList').post( async (req,res) => {
    const email = req.body.email.toString();
    const updatedFriendList = req.body.friends.toString();

    StudentRepository.updateFriendList(email,updatedFriendList)
        .then((student) => { res.json(student.friends).status(200) })
        .catch((err) => { res.json(`Error happened in updateFriendList - ${err}`).status(404) })
})


/**
 * @author: Jasmin Guay
 * Endpoint to answer a friend request.
 * @param {string} requestId  id of the request.
 * @param {"accepted" | "declined"} answer : answer to the friend request.
 * @return {string || null} studentUsername : username of the student added to the friend list if the request was accepted, null otherwise.
 */
router.route('/answerFriendRequest').post(async (req, res) => {
  const requestId = req.body.requestId.toString();
  const user = req.body.user;
  const request = await FriendRequest.findOne({_id: requestId});

  if (!validateFriendRequest(request, user) || request == null) {
    res.json(`No request found with id [${requestId}`).status(404);
  } else {
    if (req.body.answer === "accepted") {
      await addToFriendLists(request.senderEmail, request.receiverEmail);
      res.json(request.receiverEmail).status(200);
    } else {
      res.status(200)
    }

    await FriendRequestRepository.delete(requestId);
  }
});

function validateFriendRequest(request, user) {
  return user.email === request.senderEmail.toString();
}

/**
 * Helper to add 2 students in both their friend lists.
 */
async function addToFriendLists(student1, student2) {
  StudentRepository.addToFriendList(student1, student2)
      .then(() => StudentRepository.addToFriendList(student2, student1)
          .then((res) => res)
          .catch((err) => err)
      ).catch((err)=> err)
}

/**
 * @author: Jasmin Guay
 * Endpoint to display all incoming requests.
 * @param email (string) : email of the student to fetch incoming requests
 * @return {[FriendRequest]} friendRequests  : list of friend requests sent to the specified student.
 */
router.route("/incoming-requests/:email").get( async (req, res) => {
  const email = req.params.email.toString();

  FriendRequestRepository.findByReceiverEmail(email)
      .then((requests) => res.json(requests).status(200))
      .catch((err) => res.json(`Cannot fetch incoming requests for [${email}] - ${err}`))
})

/**
 * @author: Jasmin Guay
 * Endpoint to display all outgoing requests.
 * @param {string} email : email of the student to fetch outgoing requests
 * @return {[FriendRequest]} friendRequests  : list of friend requests received by the specified student.
 */
router.route("/outgoing-requests/:email").get( async (req, res) => {
  const email = req.params.email.toString();

  FriendRequestRepository.findBySenderEmail(email, 'outgoing')
      .then((requests) => res.json(requests).status(200))
      .catch((err) => res.json(`Cannot fetch outgoing requests for [${email}] - ${err}`))
})

/**
 * @author: Jasmin Guay
 * Endpoint to delete an outgoing request
 * @param requestId (string) : id of the request to be deleted
 * @return {[FriendRequest]} friendRequests : list of friend requests received by the specified student.
 */
router.route("/cancel-request").post( async (req, res) => {
    const requestId = req.body.requestId.toString();

    FriendRequestRepository.deleteFriendRequest(requestId)
        .then((requests) => res.json(requests).status(200))
        .catch((err) => res.json(`Cannot delete request with id [${requestId}] - ${err}`))
})

/**
 * @author: Jasmin Guay
 * Endpoint to search a user
 * @param {string} searchInput : text input to search a user (email or username)
 * @return {{username: string, password: string} || null} : minimal object of the user found (if profile is not private)
 */
router.route("/search").post( async (req,res) => {
  const searchInput = req.body.searchInput.toString();

  let user = await StudentRepository.findOneByEmail(searchInput);

  if (user == null) {
    user = await StudentRepository.findOneByUsername(searchInput);
  }
  if (user == null || user.privateProfile) {
    res.json(`No user found for searchInput [${searchInput}]`).status(404);
  } else {
    res.json({username: user.username ,email: user.email}).status(200);
  }
})

module.exports = router;