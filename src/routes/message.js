const router = require('express').Router();
const StudyRoom = require('../models/studyRoom.model');
const Student = require('../models/student.model');
const Message = require('../models/message.model');
const CreateMesage = require("../factory/MessageFactory");
const CreateMessage = require("../factory/MessageFactory");

// Sending a message, requires sID (study room ID it belongs to), username and content
// By default, this will limit the room messages to 30 to reduce load and document size. Use the /bulk routes below to retrieve more messages.
router.route('/send').post(async (req, res) => {
    const sID = req.body.sID.toString();
    const msg = CreateMessage(req.body);
    const room = await StudyRoom.findOne({sID: sID})
    const messages = room.messages;

    while (messages.length >= 30) {
      messages.pop();
    }
    messages.unshift(msg)

    await StudyRoom.updateOne({sID: sID}, {messages: messages})
  
    msg.save().then(() => res.json(`Message Sent`).status(200))
    var io = req.app.get('socketio');
    io.to(sID).emit('newMessage', msg)
  });

// finding message by message ID
router.route('/:mID').get(async (req, res) => {
  Message.findOne({email: req.params.email})
  .then(msg => res.json(msg).status(200))
  .catch(err => res.status(400).json('Error: ' + err));
});

// get 'amount' most recent messages in studyroom with ID sID
router.route('/bulk/:sID/:amount').get(async (req, res) => {
  const limit = parseInt(req.params.amount)
   Message.find({sID : req.params.sID}).sort({_id:-1}).limit(limit)
  .then(messages => res.json(messages).status(200))
  .catch(err => res.status(400).json('Error: ' + err));
});

// get 'amount' - 'ignore' most recent messages in studyroom with ID sID
// the query to the db does not change, the response returned will be smaller depending on the amount of messages to ignore
// ex: /bulk/:sID/15/5 would return an array of the 10 most recent messages after the first 5.
router.route('/bulk/:sID/:amount/:ignore').get(async (req, res) => {
  const limit = parseInt(req.params.amount)
  Message.find({sID : req.params.sID}).sort({_id:-1}).limit(limit)
  .then(messages => {
    messages.splice(0, parseInt(req.params.ignore))
    res.json(messages).status(200)
  })
  .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;