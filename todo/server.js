var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://localhost/angulartodo");

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded ({ extended:true }));
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(express.static(__dirname + '/app'));
app.set('port', (process.env.PORT || 5000));

var db = mongoose.connection;
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});
db.once("open", function() {
  console.log("Mongoose connection successful.");
});


app.get("/", function(req, res) {
  res.send(index.html);
});

// Handle form submission, save submission to mongo
app.post("/submit", function(req, res) {
  console.log(req.body);
  // Insert the note into the notes collection
  db.notes.insert(req.body, function(error, saved) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise, send the note back to the browser
    // This will fire off the success function of the ajax request
    else {
      res.send(saved);
    }
  });
});

// Retrieve results from mongo
app.get("/all", function(req, res) {
  // Find all notes in the notes collection
  db.notes.find({}, function(error, found) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise, send json of the notes back to user
    // This will fire off the success function of the ajax request
    else {
      res.json(found);
    }
  });
});

// Select just one note by an id
app.get("/find/:id", function(req, res) {

  // When searching by an id, the id needs to be passed in
  // as (mongojs.ObjectId(IDYOUWANTTOFIND))

  // Find just one result in the notes collection
  db.notes.findOne({
    // Using the id in the url
    "_id": mongojs.ObjectId(req.params.id)
  }, function(error, found) {
    // log any errors
    if (error) {
      console.log(error);
      res.send(error);
    }
    // Otherwise, send the note to the browser
    // This will fire off the success function of the ajax request
    else {
      console.log(found);
      res.send(found);
    }
  });
});


// Update just one note by an id
app.post("/update/:id", function(req, res) {
  
  // When searching by an id, the id needs to be passed in
  // as (mongojs.ObjectId(IDYOUWANTTOFIND))

  // Update the note that matches the object id
  db.notes.update({
    "_id": mongojs.ObjectId(req.params.id)
  }, {
    // Set the title, note and modified parameters
    // sent in the req's body.
    $set: {
      "title": req.body.title,
      "note": req.body.note,
      "modified": Date.now()
    }
  }, function(error, edited) {
    // Log any errors from mongojs
    if (error) {
      console.log(error);
      res.send(error);
    }
    // Otherwise, send the mongojs response to the browser
    // This will fire off the success function of the ajax request
    else {
      console.log(edited);
      res.send(edited);
    }
  });
});


// Delete One from the DB
app.get("/delete/:id", function(req, res) {
  // Remove a note using the objectID
  db.notes.remove({
    "_id": mongojs.ObjectID(req.params.id)
  }, function(error, removed) {
    // Log any errors from mongojs
    if (error) {
      console.log(error);
      res.send(error);
    }
    // Otherwise, send the mongojs response to the browser
    // This will fire off the success function of the ajax request
    else {
      console.log(removed);
      res.send(removed);
    }
  });
});


// Clear the DB
app.get("/clearall", function(req, res) {
  // Remove every note from the notes collection
  db.notes.remove({}, function(error, response) {
    // Log any errors to the console
    if (error) {
      console.log(error);
      res.send(error);
    }
    // Otherwise, send the mongojs response to the browser
    // This will fire off the success function of the ajax request
    else {
      console.log(response);
      res.send(response);
    }
  });
});

// require('./app/api/routes.js')(app);
//
// app.listen(app.get('port'), function() {
//     console.log('Node app is running on port', app.get('port'));
// });

app.listen(3000, function() {
    console.log("App running on port 3000!");
});
