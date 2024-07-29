console.log("Testing Node");

const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
const app = express();
const PORT = 5000;
const mongoURL = "mongodb+srv://nmonroe1883:CRUD@clusterclass.oojo7lp.mongodb.net/?retryWrites=true&w=majority&appName=ClusterClass";

// Database
MongoClient.connect(mongoURL)
  .then(client => {
    console.log("Connected to database");
    const db = client.db("test-database-Name"); // Ensure this matches your MongoDB setup
    const databaseCollection = db.collection("quotes");

    // Serve static files from the 'style' directory
    
    app.use(bodyParser.urlencoded({ extended: true }));

    // Serve the index.html file and handle database queries
    app.get("/", (req, res) => {
      db.collection('quotes')
        .find()
        .toArray()
        .then(result => {
          console.log("Database query result:", result); // Log the database query result
          res.sendFile(path.join(__dirname, "style", "index.html")); // Serve index.html
        })
        .catch(error => {
          console.error("Error retrieving quotes:", error); // Log error
          res.status(500).send("Error retrieving quotes");
        });
    });

    // Handle POST requests to add new quotes
    app.post("/quotes", (req, res) => {
      databaseCollection
        .insertOne(req.body)
        .then(result => {
          console.log("Quote added:", result); // Log the result of the insert operation
          res.status(200).redirect("/");
        })
        .catch(error => {
          console.error("Could not add to database:", error); // Log error
          res.status(500).send("Error adding quote");
        });
    });

      
    // Start the server
    app.listen(PORT, () => {
      console.log(`Testing on http://localhost:${PORT}`);
    });
    
    
    // Serve static files from the 'style' directory
    app.use(express.static(path.join(__dirname, "style")));
    

  })
  .catch(error => {
    console.error("Error cannot connect to database:", error); // Log connection errors
  });