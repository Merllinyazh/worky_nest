const express = require("express");
const {
  getTasksBySprint,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/kanbanprojectcont.js");

const router = express.Router();

router.get("/:sprintId", getTasksBySprint);
router.post("/", createTask);
router.put("/:taskId", updateTask);
router.delete("/:taskId", deleteTask);

module.exports = router;
