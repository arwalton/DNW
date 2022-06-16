const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 8086;

app.use(bodyParser.urlencoded({ extended: true }));

require("./routes/main")(app);

