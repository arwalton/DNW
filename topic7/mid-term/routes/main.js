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
        let sqlQuery = "SELECT * FROM devices;";
        // Query for existing types
        sqlQuery += "SELECT * FROM types;";
        // Query for existing functions
        sqlQuery += "SELECT * FROM functions;"
        // Query to match types to available functions
        sqlQuery += `SELECT types.typeName, functions.functionName
                    FROM ((types
                    INNER JOIN typeToFunctionMap
                    ON types.typeId = typeToFunctionMap.typeId)
                    INNER JOIN functions
                    ON typeToFunctionMap.functionId = functions.functionId);`
        // Execute query
        db.query(sqlQuery, (err,result) => {
            if(err){
                res.redirect("/");
            }
            // Convert data to useable format
            const data = result.map(item =>{
                let myStr = JSON.stringify(item);
                let json = JSON.parse(myStr);
                return json;
            })
            //Create map for types and functions
            const typeToFunction = new Map();
            data[3].forEach((item) => {
                if(typeToFunction.has(item.typeName)){
                typeToFunction.set(item.typeName, [...typeToFunction.get(item.typeName), item.functionName]);
                }else{
                    typeToFunction.set(item.typeName,[item.functionName]);
                }
            });
            // Render page passing data as props
            res.render("new-device.ejs", {
                devices: data[0],
                types: data[1],
                functions: data[2],
                typeToFunction: typeToFunction
             });
        })
    });
}