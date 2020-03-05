const { db } = require("../util/admin");

const { validateTaskData } = require("../util/validators");

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
