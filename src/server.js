const express = require('express');
const cors = require('cors');
var bodyParser = require('body-parser')
const mongoose = require('mongoose');
const socketIo = require("socket.io");


// Allows us to include environment variables in .env file
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000
const server = app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
})
const io = socketIo(server, { cors: { origin: "*" } });

// Middlewares
app.use(cors());
app.use(express.json());    // Allows us to parse json for our Mongo DB
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use((req, res, next) => {
  req.io = io;
  return next();
});

// Connect to MongoDB
const uri = process.env.ATLAS_URI;
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const connection = mongoose.connection;
  connection.once('open', () => {
    console.log("MongoDB database connection established successfully")
  })
}
else {
  console.log("Testing environment. Creating virtual mongo database.")
}


// Routes
const studentsRouter = require('./routes/student.js');
const loginRouter = require('./routes/login.js');
const roomRouter=require('./routes/room.js');
const friendRouter=require('./routes/friend.js');
const messageRouter = require('./routes/message.js')

app.use('/student', studentsRouter);
app.use('/login', loginRouter);
app.use('/room', roomRouter);
app.use('/friend', friendRouter);
app.use('/message', messageRouter);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = app;