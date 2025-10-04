// models/Task.js
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  team: [String], // You can later use ObjectId to relate to User
  progress: { type: Number, default: 0 },
  priority: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
  dueDate: Date,
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" }, // optional: if tasks are tied to a project
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
