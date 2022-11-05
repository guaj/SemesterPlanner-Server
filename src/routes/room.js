const router = require('express').Router();
const StudyRoom = require('../models/studyRoom.model');
const Student = require('../models/student.model');


//create astudy room

router.route('/').post((req, res) => {
    
  const randomID = (Math.random() + 2).toString(36).substring(2);
  const sID = randomID; 
  const owner = req.body.owner;
  const color = req.body.color
  const description=req.body.description
  const title =req.body.title
  const avatar= req.body.avatarText
  const participants= req.body.participants
  const stdr = new StudyRoom({
      sID,
      owner,
      color,
      description,
      title,
      avatar,
      participants
      })

  stdr.save()
      .then(() => res.json(`Study room ${randomID} created`).status(200))
});


// fetch email by sID
router.get('/fetch/:sID', async (req, res) => {
  console.log(req.params.sID)
  const sID= req.params.sID
  const rooms = await StudyRoom.findOne({
    sID: sID
  });
res.json(rooms).status(200);
})


// add a friend to study room
router.route('/add').post(async(req, res)=>{
  email  = req.body.email
  ID = req.body.sID
   console.log(email)
   console.log(ID)

  const room = await StudyRoom.findOne( { sID: ID })
  const participants=room.participants.push(email)

   StudyRoom.updateOne(
    { sID: ID }, 
    { participants: participants },
  );
  const student = await Student.findOne( { email:email })
  const StudyRooms=student.StudyRooms.push(sID)

  Student.updateOne(
    { email: email }, 
    { StudyRooms: StudyRooms },  
  );
})





//return room informations
router.route('/:email').get(async(req, res) => {
  
  const email= req.params.email

  const rooms = await StudyRoom.find({
    owner: email
  });
  console.log(rooms)
  res.json(rooms).status(200)
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
       res.send("deleted room "+ roomID)
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