const router = require('express').Router();
const StudyRoom = require('../models/studyRoom.model');
const Student = require('../models/student.model');
const Message = require('../models/message.model');

//Sending a message, requires sID (study room ID it belongs to), username and content
router.route('/send').post(async (req, res) => {
    const mID = (Math.random() + 2).toString(36).substring(2);
    const sID = req.body.sID;
    const username = req.body.username;
    const content = req.body.content;

    const msg = new Message({
        sID: sID,
        mID: mID,
        username: username,
        content: content
    })

    const room = await StudyRoom.findOne({sID: sID})

    var messages = room.messages;
    messages.unshift(msg)

    await StudyRoom.updateOne({sID: sID}, {messages: messages})
  
    msg.save().then(() => res.json(`Message Sent`).status(200))

  });

module.exports = router;