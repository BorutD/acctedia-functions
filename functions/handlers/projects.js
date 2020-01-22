const { db } = require("../util/admin");

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
