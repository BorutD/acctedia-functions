const { db } = require("../util/admin");

const { validateTaskData } = require("../util/validators");

exports.getTasks = (req, res) => {
  db.collection("tasks")
    .get()
    .then(data => {
      let tasks = [];
      data.forEach(doc => {
        tasks.push({
          taskId: doc.id,
          title: doc.data().title,
          description: doc.data().description,
          userHandle: doc.data().assignedUser,
          projectId: doc.data().assignedProject,
          duration: doc.data().duration,
          completed: doc.data().completed,
          createdAt: doc.data().createdAt
        });
      });
      return res.json(tasks);
    })
    .catch(err => console.error(err));
};

exports.getTasksFromProject = (req, res) => {
  db.collection("tasks")
    .where("assignedProject", "==", req.params.projectId)
    .get()
    .then(data => {
      let tasks = [];
      data.forEach(doc => {
        tasks.push({
          taskId: doc.id,
          title: doc.data().title,
          description: doc.data().description,
          userHandle: doc.data().assignedUser,
          projectId: doc.data().assignedProject,
          duration: doc.data().duration,
          completed: doc.data().completed,
          createdAt: doc.data().createdAt
        });
      });
      return res.json(tasks);
    })
    .catch(err => console.error(err));
};

exports.createTask = (req, res) => {
  const newTask = {
    title: req.body.title,
    description: req.body.description,
    assignedUser: req.user.handle,
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

exports.deleteTask = (req, res) => {
  const document = db.doc(`/tasks/${req.params.taskId}`);
  document
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Task not found" });
      }
      if (doc.data().assignedUser !== req.user.handle) {
        return res.status(403).json({ error: "Unauthorized" });
      } else {
        return document.delete();
      }
    })
    .then(() => {
      res.json({ message: "Task deleted successfully" });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
