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
        sID,
        owner,
        color,
        description,
        title,
        avatar,
        })

    stdr.save()
        .then(() => res.json(`Study room ${r} created`).status(200))
});

//return room informations
router.route('/:username').get(async(req, res) => {
  
  const username= req.params.username

  const rooms = await StudyRoom.find({
    owner: username
  });
  console.log(rooms)
  res.json(rooms)
  

})


//delete  the study room you need the username of the owner and the roomID
router.route('/delete').post(async(req, res) => {
  console.log(req.body)
  const username= req.body.username
  const roomID= req.body.sID



  const room = await StudyRoom.deleteOne({
        sID:roomID,
        owner:username 

      });



       res.send("deleted room "+roomID)
  



})

//Send a message to a chate it needs the username of the sender, the content of the message and
//sID of the study room, the content of the message, and the username of the user

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


//upload a file to the database  file needs to be transformed to a buffer be being sent
// the user should send he ID of the study room, 
router.route('/file').post(async(req, res) => {

    let notes;
    let r = (Math.random() + 1).toString(36).substring(7);


    const roomID  = req.body.sID; 
    const file =  req.body.file;
    const type = req.body.type;
    const username = req.body.username;
     

     console.log(roomID)

    const room = await StudyRoom.findOne({
        sID:roomID,
      });

    let note = {
         cnID:r,
         username:username,
         file:file,
         type:type
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