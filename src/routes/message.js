const router = require('express').Router();
const MessageRepository = require("../repository/messageRepository")
const MessageValidator = require('../validator/messageValidator')
const TokenVerify = require('./tokenVerification').verifyJWTAuth;


// Sending a message, requires studyRoomID (study room ID it belongs to), username and content
router.route('/send').post(TokenVerify, (req, res) => {
  const studyRoomID = req.body.studyRoomID.toString();
  MessageValidator.validateCreateData(req.body).then(() => {
    MessageRepository.create(req.body)
      .then((message) => {
        let io = req.app.get('socketio');
        io.to(studyRoomID).emit('newMessage', message)
        res.json(message).status(200)
      })
  })
    .catch(err => res.status(400).json(err));
});

// finding message by message ID
router.route('/:messageID').get(TokenVerify, (req, res) => {

  MessageRepository.findOne(req.params.messageID)
    .then(msg => res.json(msg).status(200))
    .catch(err => res.status(400).json(err));
});

// get 'amount' most recent messages in studyroom with ID studyRoomID
router.route('/bulk/:studyRoomID/:amount').get(TokenVerify, (req, res) => {
  MessageValidator.validateBulkRetrieve(req.params.amount).then(() => {
    MessageRepository.findMostRecent(req.params.studyRoomID, parseInt(req.params.amount))
      .then(messages => res.json(messages).status(200))
      .catch(err => res.status(400).json(err));
  })
    .catch(err => res.status(400).json(err));
});

// get 'amount' of messages after 'ignore'
// the query to the db does not change, the response returned will be smaller depending on the amount of messages to ignore
// ex: /bulk/:studyRoomID/15/5 would return an array of the 15 most recent messages after the first 5.
router.route('/bulk/:studyRoomID/:amount/:ignore').get(TokenVerify, (req, res) => {
  MessageValidator.validateBulkRetrieveIgnore(req.params.amount, req.params.ignore).then(() => {
    MessageRepository.findMostRecent(req.params.studyRoomID, parseInt(req.params.amount) + parseInt(req.params.ignore))
      .then(messages => {
        messages.splice(0, parseInt(req.params.ignore))
        res.json(messages).status(200)
      })
      .catch(err => res.status(400).json(err));
  })
    .catch(err => res.status(400).json(err));
});

module.exports = router;