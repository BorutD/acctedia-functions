const functions = require("firebase-functions");
const app = require("express")();
const FBAuth = require("./util/fbAuth");

const cors = require("cors");
app.use(cors());

const {
  getProjects,
  createProject,
  createTask
} = require("./handlers/projects");
const { signup, login } = require("./handlers/users");

// Project routes
app.get("/projects", getProjects);
app.post("/project", FBAuth, createProject);
app.post("/task", FBAuth, createTask);

// Users routes
app.post("/signup", signup);
app.post("/login", login);

exports.api = functions.region("europe-west2").https.onRequest(app);
