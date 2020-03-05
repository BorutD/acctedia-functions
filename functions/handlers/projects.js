const { db } = require("../util/admin");

const { validateProjectData } = require("../util/validators");

exports.getProjects = (req, res) => {
  db.collection("projects")
    .orderBy("createdAt", "desc")
    .get()
    .then(data => {
      let projects = [];
      data.forEach(doc => {
        projects.push({
          projectId: doc.id,
          title: doc.data().title,
          description: doc.data().description,
          adminHandle: doc.data().adminHandle,
          assignedUsers: doc.data().assignedUsers,
          createdAt: doc.data().createdAt
        });
      });
      return res.json(projects);
    })
    .catch(err => console.error(err));
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

exports.updateProject = (req, res) => {
  let projectDetails = req.body;

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
        return document.update(projectDetails);
      }
    })
    .then(() => {
      return res.json({ message: "Details updated/added successfully" });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
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
