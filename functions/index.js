const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

exports.getProjects = functions.https.onRequest((req, res) => {
  admin
    .firestore()
    .collection("projects")
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
});

exports.createProject = functions.https.onRequest((req, res) => {
  const newProject = {
    projectName: req.body.projectName,
    adminHandle: req.body.adminHandle,
    createdAt: admin.firestore.Timestamp.fromDate(new Date())
  };

  admin
    .firestore()
    .collection("projects")
    .add(newProject)
    .then(doc => {
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch(err => {
      res.status(500).json({ error: "Something went wrong" });
      console.error(err);
    });
});
