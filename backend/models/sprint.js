const mongoose = require("mongoose");

const sprintSchema = new mongoose.Schema({
  projectId: { type: String, required: true },
  name: { type: String, required: true },
  duration: String,
  assigned: String,
  techStack: String,
  comment: String,
  completed: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Sprint", sprintSchema);
