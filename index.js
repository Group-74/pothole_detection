const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 3000;

// MongoDB connection string
const mongoURI =
  "mongodb+srv://bryanojji4:6DcKLQOfVrZkjYBw@potholesite.6wt2x95.mongodb.net/?retryWrites=true&w=majority&appName=potholesite";

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
