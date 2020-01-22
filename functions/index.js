const functions = require("firebase-functions");
const app = require("express")();
// const FBAuth = require("./util/fbAuth");

const cors = require("cors");
app.use(cors());

const { getProjects, createProject } = require("./handlers/projects");

// Project routes
app.get("/projects", getProjects);
app.post("/project", createProject);

exports.api = functions.region("europe-west2").https.onRequest(app);
