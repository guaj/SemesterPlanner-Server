const router = require('express').Router();
const StudyRoom = require('../models/studyRoom.model');
const Student = require('../models/student.model');
const courseNotes = require('../models/CourseNotes');
const multer =  require('multer');
const fs = require('fs');
var path = require('path');
const { db } = require('../models/student.model');


const Storage = multer.diskStorage({
destination:(req,file,cb)=>{

  cb(null,'uploads')
  
  },
filename:(req,file,cb)=>{

cb(null,file.originalname)

}
})

const upload = multer({
storage:Storage

})


router.route('/').put((req, res) => {



  StudyRoom.findOne({sID: req.body.sID.toString()})
  .then(room => {
      if (req.body.owner) {
          room.owner = req.body.owner;
      }
      if (req.body.color) {
          room.color = req.body.color;
      }
      if (req.body.description) {
          room.description = req.body.description;
      }
      if (req.body.title) {
          room.title = req.body.title;
      }
      if (req.body.avatarText) {
          room.avatarText = req.body.avatarText;
      }
      if (req.body.participants) {
          room.participants= req.body.participants;
      }
      

      room.save()
          .then(() => res.json(`Room ${room.sID} updated`))
          .catch(err => res.status(400).json('Error: ' + err));
  })
  .catch(err => res.status(400).json('Error: ' + err));





})

//create a study room
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
/**
 * Study room info route
 * @param sID: ID  of the study room
 * @return room: the room matching the study room ID
 */
router.get('/fetch/:sID', async (req, res) => {
  console.log(req.params.sID)
  const sID= req.params.sID.toString()
  const rooms = await StudyRoom.findOne({
    sID: sID
  });
res.json(rooms).status(200);
})


// add a friend to study room
router.route('/add').post(async(req, res)=>{
  email  = req.body.email.toString()
  ID = req.body.sID.toString()
   console.log(email)
   console.log(ID)

  const room = await StudyRoom.findOne( { sID: ID })
  const participants=room.participants.push(email)

   StudyRoom.updateOne(
    { sID: ID }, 
    { participants: participants },
  );
  const student = await Student.findOne( { email: email })
  const StudyRooms=student.StudyRooms.push(sID)

  Student.updateOne(
    { email: email }, 
    { StudyRooms: StudyRooms },  
  );
})





/**
 * Email route
 * @param email: email of the student
 * @return rooms: that the student is part of
*/
router.route('/:email').get(async(req, res) => {
  
  const email= req.params.email.toString()
  const rooms = await StudyRoom.find({
    participants: {"$in": [email]}
  });
  console.log(rooms)
  res.json(rooms).status(200)
  })


//delete  the study room you need the username of the owner and the roomID
router.route('/delete').post(async(req, res) => {
  console.log(req.body)
  const email= req.body.email.toString()
  const roomID= req.body.sID.toString()
  const room = await StudyRoom.deleteOne({
        sID:roomID,
        owner:email

      });
       res.send("deleted room "+ roomID.toString())
  })

//Send a message to a chate it needs the username of the sender, the content of the message and
//sID of the study room, the content of the message, and the username of the user



router.route('/message').post(async(req, res) => {

    
    let r = (Math.random() + 1).toString(36).substring(7);


    const roomID  = req.body.sID.toString();
    const content = req.body.content.toString();
    const username = req.body.username.toString();


     console.log(roomID) 

    const room = await StudyRoom.findOne({
        sID:roomID,
      });

      let message = {
         mID:r,
         username:username,
         content:content,
         time:date.now()
      }
      console.log("mil ="+room.messages);
      var mil = room.messages
      mil.push(message) 
     console.log(mil)
      StudyRoom.updateOne(
        { sID: roomID },
        { messages: messages.toString() },
        (err, docs) => {
          if (err) {
            console.log(err);
          } else {
            console.log('Updated Docs : ', docs);
          }
        },
      );
       
});


router.route('message/:sID').get(async(req, res) => {


     const sID= req.params.sID
     const room =  await StudyRoom.findOne({sID:sID})
     var chatmessages= room.messages
     res.json(chatmessages).status(200)

      
})





//upload a file to the database  file needs to be transformed to a buffer be being sent
// the user should send he ID of the study room, 
router.post('/file', upload.single("file"), (req, res) => {

  let r = (Math.random() + 1).toString(36).substring(7);
        const newImage= new courseNotes({
         cnID:r,
         sID:req.body.sID,
         email:req.body.email,
         filetype:req.body.type,
         file:{
          data: fs.readFileSync('uploads/' + req.file.filename),
          contentType:req.body.type 
         }

        })

        newImage.save().then(()=>res.send("successfuly uploaded"))

        
        
        
       



       

      

    
});


//get file

router.route('/file/:sID&:cnID').get(async(req, res) => {

  const sID= req.params.sID.toString()
  const cnID= req.params.cnID.toString()


 const note =  await courseNotes.find({
    sID:sID,
    cnID: cnID
})

res.json(note).status(200);
})









module.exports = router;