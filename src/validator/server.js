const express = require('express');
const cors = require('cors');
var bodyParser = require('body-parser')
const mongoose = require('mongoose');

// Allows us to include environment variables in .env file
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000
let server;

if (process.env.NODE_ENV !== 'test') {
  server = app.listen(port, () => console.log(`Listening on port ${port}`))
}

var io = require('socket.io')(server, {
  cors: {
    origin: process.env.CLIENT_BASE_URL,
    methods: ["GET", "POST"]
  }
});
app.set('socketio', io);

// Middlewares
app.use(cors());
app.use(express.json());    // Allows us to parse json for our Mongo DB
app.use(bodyParser.urlencoded({
  extended: true
}));

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
const studentsRouter = require('../routes/student.js');
const loginRouter = require('../routes/login.js');
const roomRouter = require('../routes/room.js');
const friendRouter = require('../routes/friend.js');
const messageRouter = require('../routes/message.js')
const eventsRouter = require('../routes/events.js')
const openDataRouter = require('../routes/opendata.js')

app.use('/student', studentsRouter);
app.use('/login', loginRouter);
app.use('/room', roomRouter);
app.use('/friend', friendRouter);
app.use('/message', messageRouter);
app.use('/events', eventsRouter);
app.use('/opendata', openDataRouter);

// Sockets
io.sockets.on('connection', function (socket) {
  socket.on('create', function (room) {
    socket.join(room);
    console.log("User joined " + room)
  });
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Unhandled Promise: ${err} ${err.stack}`);
  // Close server & exit process
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.log(`Unexpected Error: ${err} ${err.stack}`);
  // Close server & exit process
  process.exit(1);
});

module.exports = app;