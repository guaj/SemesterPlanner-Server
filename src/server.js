// Dummy server to test the CI CD pipeline.

const express = require("express");
const cors = require("cors");



const app = express();

app.use(cors());

// Body parser
app.use(express.json());

const PORT = process.env.PORT || 5000;

const server = app.listen(
PORT,
console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
)
);

app.get("/", (req, res) => res.send("API Running"));

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = app;