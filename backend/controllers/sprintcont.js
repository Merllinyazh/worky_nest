// controllers/sprintController.js
const Sprint = require("../models/sprint");

// Get all sprints for a specific project
exports.getSprintsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const sprints = await Sprint.find({ projectId });
    res.status(200).json(sprints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single sprint by ID
exports.getSprintById = async (req, res) => {
  try {
    const sprint = await Sprint.findById(req.params.id);
    if (!sprint) return res.status(404).json({ message: "Sprint not found" });
    res.status(200).json(sprint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new sprint
exports.createSprint = async (req, res) => {
  try {
    const sprint = await Sprint.create(req.body);
    res.status(201).json(sprint);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update an existing sprint
exports.updateSprint = async (req, res) => {
  try {
    const updatedSprint = await Sprint.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedSprint) return res.status(404).json({ message: "Sprint not found" });
    res.status(200).json(updatedSprint);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a sprint
exports.deleteSprint = async (req, res) => {
  try {
    const deleted = await Sprint.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Sprint not found" });
    res.status(200).json({ message: "Sprint deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
