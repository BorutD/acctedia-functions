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
    projectName: req.body.projectName,
    adminHandle: req.body.adminHandle,
    createdAt: new Date().toISOString()
  };

  const { valid, errors } = validateProjectData(newTask);

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
