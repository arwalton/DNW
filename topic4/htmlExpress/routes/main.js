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
}