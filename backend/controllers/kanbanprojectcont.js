const KanbanProject = require("../models/kanbanproject.js");

// Get tasks by sprint
exports.getTasksBySprint = async (req, res) => {
  try {
    const tasks = await KanbanProject.find({ sprintId: req.params.sprintId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { projectName, sprintName, sprintId, content, status } = req.body;
    const newTask = new KanbanProject({ projectName, sprintName, sprintId, content, status });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create task" });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const updates = {};
    if (req.body.content !== undefined) updates.content = req.body.content;
    if (req.body.status !== undefined) updates.status = req.body.status;

    const updatedTask = await KanbanProject.findByIdAndUpdate(
      req.params.taskId,
      updates,
      { new: true }
    );

    if (!updatedTask) return res.status(404).json({ error: "Task not found" });
    res.json(updatedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update task" });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const deletedTask = await KanbanProject.findByIdAndDelete(req.params.taskId);
    if (!deletedTask) return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete task" });
  }
};
