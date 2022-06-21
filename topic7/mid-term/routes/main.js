module.exports = (app) => {
    // Home route
    app.get("/", (req,res)=>{
        res.render("index.ejs")
    });

    // About page route
    app.get("/about", (req,res)=>{
        res.render("about.ejs")
    });

    // Add device route
    app.get("/new-device", (req,res)=>{
        // Query for existing devices
        let sqlQuery = "SELECT * FROM devices";
        // Execute query
        db.query(sqlQuery, (err,result) => {
            if(err){
                res.redirect("/");
            }
            console.log(result);
            const names = result.map(item =>{
                let myStr = JSON.stringify(item);
                let json = JSON.parse(myStr);
                return json.deviceName;
            })
            console.log(names);
            })
        res.render("new-device.ejs")
    });
}