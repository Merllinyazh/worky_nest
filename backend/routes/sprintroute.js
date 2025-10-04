const express = require("express");
const router = express.Router();
const {
  getSprintsByProject,
  getSprintById,
  createSprint,
  updateSprint,
  deleteSprint,
} = require("../controllers/sprintcont");

router.get("/:projectId", getSprintsByProject);
router.get("/sprint/:id", getSprintById);
router.post("/", createSprint);
router.put("/:id", updateSprint);
router.delete("/:id", deleteSprint);


module.exports = router;
