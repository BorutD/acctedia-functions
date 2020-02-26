const { db } = require("../util/admin");

const { validateTaskData, validateProjectData } = require("../util/validators");

exports.getProjects = (req, res) => {
  db.collection("projects")
    .get()
    .then(data => {
      let projects = [];
      data.forEach(doc => {
        projects.push(doc.data());
      });
      return res.json(projects);
    })
    .catch(err => {
      console.error(err);
    });
};

exports.createProject = (req, res) => {
  const newProject = {
    title: req.body.title,
    description: req.body.description,
    assignedUsers: req.body.assignedUsers,
    adminHandle: req.user.handle,
    createdAt: new Date().toISOString()
  };

  const { valid, errors } = validateProjectData(newProject);

  if (!valid) return res.status(400).json(errors);

  db.collection("projects")
    .add(newProject)
    .then(doc => {
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch(err => {
      res.status(500).json({ error: "Something went wrong" });
      console.error(err);
    });
};

exports.createTask = (req, res) => {
  const newTask = {
    title: req.body.title,
    description: req.body.description,
    assignedUser: req.body.assignedUser,
    assignedProject: req.body.assignedProject,
    duration: req.body.duration,
    completed: req.body.completed,
    createdAt: new Date().toISOString()
  };

  const { valid, errors } = validateTaskData(newTask);

  if (!valid) return res.status(400).json(errors);

  db.collection("tasks")
    .add(newTask)
    .then(doc => {
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch(err => {
      res.status(500).json({ error: "Something went wrong" });
      console.error(err);
    });
};

exports.getProject = (req, res) => {
  let projectData = {};
  db.doc(`/projects/${req.params.projectId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Project not found" });
      }
      projectData = doc.data();
      return res.json(projectData);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.deleteProject = (req, res) => {
  const document = db.doc(`/projects/${req.params.projectId}`);
  document
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Project not found" });
      }
      if (doc.data().adminHandle !== req.user.handle) {
        return res.status(403).json({ error: "Unauthorized" });
      } else {
        return document.delete();
      }
    })
    .then(() => {
      res.json({ message: "Project deleted successfully" });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
