const router = require('express').Router();
const StudyRoom = require('../models/studyRoom.model');


router.route('/').post((req, res) => {
    
    let r = (Math.random() + 2).toString(36).substring(2);
    console.log(r)
    
    const sID = r;
    const owner = req.body.owner;
    const color = req.body.color
    const description=req.body.description
    const title =req.body.title
    const avatar= req.body.avatarText
    
   /// const  participant= req.body.participant;
    

    const stdr = new StudyRoom({
        sID ,
        owner,
        color,
        description,
        title,
        avatar,
        })

    stdr.save()
        .then(() => res.json(`Study room ${r} created`).status(200))
});



router.route('/').get(async(req, res) => {
  const username= req.body.username

  const rooms = await StudyRoom.find({
    owner: username
  });

  res.json(rooms)






})


router.route('/message').post(async(req, res) => {

    let messages;
    let r = (Math.random() + 1).toString(36).substring(7);


    const roomID  = req.body.sID;
    const content = req.body.content;
    const username = req.body.username;


     console.log(roomID)

    const room = await StudyRoom.findOne({
        sID:roomID,
      });

      let message = {
         mID:r,
         username:username,
         content:content
      }
      console.log(room);
      messages = room.messages
      messages.push(message)

      StudyRoom.updateOne(
        { sID: roomID },
        { messages: messages },
        (err, docs) => {
          if (err) {
            console.log(err);
          } else {
            console.log('Updated Docs : ', docs);
          }
        },
      );
       

      

    
});


//upload a file to the database not yet complete
router.route('/file').post(async(req, res) => {

    let notes;
    let r = (Math.random() + 1).toString(36).substring(7);


    const roomID  = req.body.sID; 
    const file =  req.body.file;
    const username = req.body.username;
     

     console.log(roomID)

    const room = await StudyRoom.findOne({
        sID:roomID,
      });

    let note = {
         nID:r,
         username:username,
         file:file
      }
      console.log(room);
      notes = room.courseNotes
      notes.push(note)

      StudyRoom.updateOne(
        { sID: roomID },
        { courseNotes: notes },
        (err, docs) => {
          if (err) {
            console.log(err);
          } else {
            console.log('Updated Docs : ', docs);
          }
        },
      );
       

      

    
});












module.exports = router;