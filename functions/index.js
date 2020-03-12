const functions = require("firebase-functions");
const app = require("express")();
const FBAuth = require("./util/fbAuth");

const cors = require("cors");
app.use(cors());

const {
  getProjects,
  getProject,
  createProject,
  deleteProject,
  updateProject
} = require("./handlers/projects");

const {
  getTasks,
  createTask,
  getTasksFromProject,
  deleteTask
} = require("./handlers/tasks");

const { getUsers, signup, login } = require("./handlers/users");

// Project routes
app.get("/projects", getProjects);
app.get("/project/:projectId", getProject);
app.post("/project", FBAuth, createProject);
app.delete("/project/:projectId", FBAuth, deleteProject);
app.post("/project/:projectId", FBAuth, updateProject);

// Task routes
app.get("/tasks", getTasks);
app.get("/:projectId/tasks", getTasksFromProject);
app.post("/task", FBAuth, createTask);
app.delete("/task/:taskId", FBAuth, deleteTask);

// Users routes
app.get("/users", getUsers);
app.post("/signup", signup);
app.post("/login", login);

exports.api = functions.region("europe-west2").https.onRequest(app);
