const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI =
  "mongodb+srv://bryanojji4:6DcKLQOfVrZkjYBw@potholesite.6wt2x95.mongodb.net/?retryWrites=true&w=majority&appName=potholesite";

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Define schema and model for pothole data
const PotholeSchema = new mongoose.Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});
const Pothole = mongoose.model("Pothole", PotholeSchema);

app.get("/api/potholes", async (req, res) => {
  console.log("Request received:", req.method, req.url);

  try {
    const potholes = await Pothole.find();
    res.status(200).json(potholes);
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ message: "Error retrieving data", error: err });
  }
});

app.post("/api/potholes", async (req, res) => {
  const { lat, lng } = req.body;
  try {
    const existingPothole = await Pothole.findOne({
      latitude: lat,
      longitude: lng,
    });
    if (existingPothole) {
      return res.status(200).json({ message: "Duplicate pothole data" });
    }

    const newPothole = new Pothole({ latitude: lat, longitude: lng });
    await newPothole.save();
    res
      .status(200)
      .json({ message: "Pothole data received", data: newPothole });
  } catch (err) {
    console.error("Error saving data:", err);
    res.status(400).json({ message: "Error saving data", error: err });
  }
});

app.listen(3001, () => {
  console.log("API server running on port 3001");
});
