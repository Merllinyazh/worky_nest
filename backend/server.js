const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// DB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Routes
//app.use("/api/auth", require("./routes/authroute"));
app.use("/api/kanbanprojects", require("./routes/kanbanprojectroute"));
app.use("/api/tasks", require("./routes/taskroute"));
app.use("/api/sprints", require("./routes/sprintroute"))
//app.use("/api/teams", require("./routes/teamroute"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
