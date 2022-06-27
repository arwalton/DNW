const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// Set up database
const mysql = require('mysql');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'midterm',
  password: '%wqAWjXEZtJBq@Pa@S86',
  database: 'mySmartHome',
  multipleStatements: true
});

// Connect to the database
db.connect((err)=>{
  if(err){
    throw err;
  }
  console.log("Connected to database");
});
global.db = db;

const port = 8089;

// Add GNU Terry Pratchett to site
app.use(function (req, res, next) {
  res.set('X-Clacks-Overhead', 'GNU Terry Pratchet');
  next();
});

// Add a static folder called public to App
app.use(express.static( "public" ));

// Set the app to use body-parser
app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());

// Set the view engine to ejs
app.set("view-engine", "ejs");

// Set the views to come from the views directory
app.set("views",__dirname + "/views");

// Tell the engine to render html files with ejs
app.engine("html", require("ejs").renderFile);

// Get the routes from the main.js file in the routes directory
require("./routes/main")(app);

// Tell the server to listen on port
app.listen(port, ()=>console.log(`Example app listening on port ${port}!`));