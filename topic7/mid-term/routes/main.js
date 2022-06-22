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
        let sqlQuery1 = "SELECT * FROM devices;";
        sqlQuery1 += "SELECT * FROM types;";
        // Execute query
        db.query(sqlQuery1, (err,result) => {
            if(err){
                res.redirect("/");
            }
            // Extract device data from result
            const devices = result[0].map(item =>{
                let myStr = JSON.stringify(item);
                let json = JSON.parse(myStr);
                return json;
            })
            // Extract type data from result
            const types = result[1].map(item =>{
                let myStr = JSON.stringify(item);
                let json = JSON.parse(myStr);
                return json;
            })
            // Render page passing data as props
            res.render("new-device.ejs", {
                devices: devices,
                types: types
             });
        })
    });
}