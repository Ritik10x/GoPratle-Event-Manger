const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const RequirementSchema = new mongoose.Schema(
  {
    eventName: String,
    eventType: String,
    date: String,
    location: String,
    venue: String,
    hireType: {
      type: String,
      enum: ["planner", "performer", "crew"],
    },
    details: Object,
  },
  { timestamps: true }
);

const Requirement = mongoose.model("Requirement", RequirementSchema);

app.post("/api/requirements", async (req, res) => {
  try {
    const requirement = new Requirement(req.body);
    await requirement.save();
    res.json({ success: true, data: requirement });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

app.get("/api/requirements", async (req, res) => {
  const data = await Requirement.find();
  res.json(data);
});

app.listen(5000, () =>
  console.log("Backend running on http://localhost:5000")
);
