const express = require('express');
const cors = require('cors');
let bodyParser = require('body-parser')
const mongoose = require('mongoose');

// Allows us to include environment variables in .env file
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000
let server;

if (process.env.NODE_ENV !== 'test') {
  server = app.listen(port, () => console.log(`Listening on port ${port}`))
}

let io = require('socket.io')(server, {
  cors: {
    origin: process.env.CLIENT_BASE_URL,
    methods: ["GET", "POST"]
  }
});
app.set('socketio', io);

// this configuration is required to ensure cookie is set on client-side
const corsOptions = {
  origin: process.env.CLIENT_BASE_URL,
  credentials: true,
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());    // Allows us to parse json for our Mongo DB
app.use(bodyParser.urlencoded({
  extended: true
}));
app.disable("x-powered-by"); // disable fingerprinting of the website's technology

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
const roomRouter = require('./routes/room.js');
const friendRouter = require('./routes/friend.js');
const messageRouter = require('./routes/message.js');
const eventsRouter = require('./routes/events.js');
const openDataRouter = require('./routes/opendata.js');
const tesseractRouter = require('./routes/tesseract.js');

app.use('/student', studentsRouter);
app.use('/login', loginRouter);
app.use('/room', roomRouter);
app.use('/friend', friendRouter);
app.use('/message', messageRouter);
app.use('/events', eventsRouter);
app.use('/opendata', openDataRouter);
app.use('/tesseract', tesseractRouter);

// Sockets
io.sockets.on('connection', function (socket) {
  socket.on('create', function (room) {
    socket.join(room);
    console.log("User joined " + room)
  });
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
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