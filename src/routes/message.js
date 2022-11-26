const router = require('express').Router();
const MessageRepository = require("../repository/messageRepository")
const MessageValidator = require('../validator/messageValidator')

// Sending a message, requires studyRoomID (study room ID it belongs to), username and content
router.route('/send').post(async (req, res) => {
  const studyRoomID = req.body.studyRoomID.toString();
  MessageValidator.validateCreateData(req.body).then(() => {
    MessageRepository.create(req.body)
      .then((message) => {
        var io = req.app.get('socketio');
        io.to(studyRoomID).emit('newMessage', message)
        res.json(message).status(200)
      })
  })
    .catch(err => res.status(400).json(err));
});

// finding message by message ID
router.route('/:messageID').get(async (req, res) => {

  MessageRepository.findOne(req.params.messageID)
    .then(msg => res.json(msg).status(200))
    .catch(err => res.status(400).json(err));
});

// get 'amount' most recent messages in studyroom with ID studyRoomID
router.route('/bulk/:studyRoomID/:amount').get(async (req, res) => {
  MessageRepository.findMostRecent(req.params.studyRoomID, parseInt(req.params.amount))
    .then(messages => res.json(messages).status(200))
    .catch(err => res.status(400).json(err));
});

// get 'amount' - 'ignore' most recent messages in studyroom with ID studyRoomID
// the query to the db does not change, the response returned will be smaller depending on the amount of messages to ignore
// ex: /bulk/:studyRoomID/15/5 would return an array of the 10 most recent messages after the first 5.
router.route('/bulk/:studyRoomID/:amount/:ignore').get(async (req, res) => {
  MessageRepository.findMostRecent(req.params.studyRoomID, parseInt(req.params.amount))
    .then(messages => {
      messages.splice(0, parseInt(req.params.ignore))
      res.json(messages).status(200)
    })
    .catch(err => res.status(400).json(err));
});

module.exports = router;