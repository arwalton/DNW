module.exports = (app) => {
    // Home route
    app.get("/", function(req,res){
        res.render("index.ejs")
    });

    // About page route
    app.get("/about", function(req,res){
        res.render("about.ejs")
    });
}