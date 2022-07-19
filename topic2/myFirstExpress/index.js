const express = require("express");
const app = express();
const port = 8083;

app.get("/",(req,res) => res.send("<h1>This is my home page</h1>"));
app.get("/about",(req, res) => res.send("<h1>This is the about page</h1>"));
app.get("/search",(req, res) => res.send("<h1>This will be a search page</h1>"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));