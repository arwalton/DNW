const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 8089;

// Add GNU Terry Pratchett to site
app.use(function (req, res, next) {
  res.set('X-Clacks-Overhead', 'GNU Terry Pratchet');
  next();
});

// Get the routes from the main.js file in the routes directory
require("./routes/main")(app);

// Set the app to use body-parser
app.use(bodyParser.urlencoded({extended: true}));

// Set the view engine to ejs
app.set("view-engine", "ejs");

// Set the views to come from the views directory
app.set("views",__dirname + "/views");

// Tell the engine to render html files with ejs
app.engine("html", require("ejs").renderFile);

// Tell the server to listen on port
app.listen(port, ()=>console.log(`Example app listening on port ${port}!`));