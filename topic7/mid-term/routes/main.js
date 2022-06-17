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
        res.render("new-device.ejs")
    });
}