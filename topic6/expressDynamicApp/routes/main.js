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

    app.get("/list", function(req, res) {
        // query database to get all the books
        let sqlquery = "SELECT * FROM books;";
        // execute sql query
        db.query(sqlquery, (err, result) => {
        if (err) {
            console.log(err)
        res.redirect("/");
        }
        res.render("list.html",{availableBooks:result});
        });
    });
    
    app.get("/addbook", function(req,res){
        res.render("addbook.html")
    });
    
    app.post("/bookadded", function (req,res) {
    // saving data in database
    let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)";
    // execute sql query
    let newrecord = [req.body.name, req.body.price];
    db.query(sqlquery, newrecord, (err, result) => {
    if (err) {
    return console.error(err.message);
    }else
    res.send(" This book is added to database, name: "+ req.body.name + " price "+
    req.body.price);
    });
    });

    app.get("/search-result-db", function (req, res) {
        //searching in the database
        let word = [req.query.keyword];
        let sqlquery = "SELECT * FROM `books` WHERE name like ?";
        // execute sql query
        db.query(sqlquery,word, (err, result) => {
        if (err) {
        return console.error("No book found with the keyword you have entered" + req.query.keyword + "error: "+ err.message);
        //res.redirect("./search"); this can also be used in case of an error instead of
        // the above line
        }else{
        //step 1:(this will only shows the collected form-data) for debugging purpose only
        // res.send(req.query);
        //step 2: (this shows keyword in collected form-data) for debugging purpose only
        //res.send("This is the keyword you entered: "+ req.query.keyword+
        // ".<br><br>This is the result of the search:<br>");
        //step3: (this will show the result of the search) for debugging purpose only
        //res.send(result);
        //step4: (this will show the result of the search using an ejs template file, list.ejs can be used
        // here)
        res.render ('list.html',{availableBooks:result});
        }
        });
       });
}