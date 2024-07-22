const mongoose = require("mongoose");
const { VercelRequest, VercelResponse } = require("@vercel/node");

const mongoURI =
  process.env.MONGO_URI ||
  "mongodb+srv://bryanojji4:6DcKLQOfVrZkjYBw@potholesite.6wt2x95.mongodb.net/?retryWrites=true&w=majority&appName=potholesite";

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Define schema and model for pothole data
const PotholeSchema = new mongoose.Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});
const Pothole = mongoose.model("Pothole", PotholeSchema);

module.exports = async (req, res) => {
  if (req.method === "GET") {
    try {
      const potholes = await Pothole.find();
      res.status(200).json(potholes);
    } catch (err) {
      res.status(500).json({ message: "Error retrieving data", error: err });
    }
  } else if (req.method === "POST") {
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
      res.status(400).json({ message: "Error saving data", error: err });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
};
