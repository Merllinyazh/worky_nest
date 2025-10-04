const mongoose = require("mongoose");

const kanbanProjectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  sprintName: { type: String, required: true },
  sprintId: { type: mongoose.Schema.Types.ObjectId, ref: "Sprint", required: true },
  content: { type: String, required: true },
  status: { type: String, enum: ["todo", "inProgress", "review", "completed"], default: "todo" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("KanbanProject", kanbanProjectSchema);
