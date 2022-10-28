const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Allows us to include environment variables in .env file
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000

// Middlewares
app.use(cors());
app.use(express.json());    // Allows us to parse json for our Mongo DB

// Connect to MongoDB
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully")
})

// Routes
const studentsRouter = require('./routes/student.js');
const loginRouter = require('./routes/login.js');

app.use('/student', studentsRouter);
app.use('/login', loginRouter);

const server = app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
})

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = app;