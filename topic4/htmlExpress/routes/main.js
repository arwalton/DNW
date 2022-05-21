module.exports = function(app) {
    
    app.get("/", function(req,res){
        res.render("index.html")
    });

    app.get("/search",function(req, res){
        res.setHeader('X-Clacks-Overhead', 'GNU Terry Pratchett');
        res.render("search.html")
    });

    app.get("/about",function(req, res){
        res.setHeader('X-Clacks-Overhead', 'GNU Terry Pratchett');
        res.render("about.html")
    });

    app.get("/search-result",function(req, res) {
        //searching the database
        res.send("This is the keyword you entered: " + 
        req.query.keyword +
        "<br>" +
        "This is the result of the search.");
    });

    app.get("/register",function(req, res) {
        res.render("register.html");
    });

    app.post("/registered",function(req,res){
        //saving data in database
        res.send("Hello " + req.body.first + " " + req.body.last + ", you are now registered!" + "<br>" +
        "We will send you an email to your email address: " + req.body.email);
    });
}