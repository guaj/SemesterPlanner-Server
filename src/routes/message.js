const router = require('express').Router();
const StudyRoom = require('../models/studyRoom.model');
const Student = require('../models/student.model');
const Message = require('../models/message.model');
const CreateMesage = require("../factory/MessageFactory");
const CreateMessage = require("../factory/MessageFactory");

//Sending a message, requires sID (study room ID it belongs to), username and content
router.route('/send').post(async (req, res) => {
    const sID = req.body.sID;
    const msg = CreateMessage(req.body);
    const room = await StudyRoom.findOne({sID: sID})
    const messages = room.messages;

    messages.unshift(msg)

    await StudyRoom.updateOne({sID: sID}, {messages: messages})
  
    msg.save().then(() => res.json(`Message Sent`).status(200))

  });

module.exports = router;