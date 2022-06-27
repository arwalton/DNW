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
            //Create a map for types and functions
            const typeToFunctionMap = new Map();
            data[3].forEach((item) => {
                // Format funcName to be used as class identifiers later
                funcName = item.functionName.toLowerCase().replaceAll(/[\s\/]/g,"_");
                if(typeToFunctionMap.has(item.typeName)){
                typeToFunctionMap.set(item.typeName, [...typeToFunctionMap.get(item.typeName), funcName]);
                }else{
                    typeToFunctionMap.set(item.typeName,[funcName]);
                }
            });
            const typeToFunction = Object.fromEntries(typeToFunctionMap);
            // Render page passing data as props
            res.render("new-device.ejs", {
                devices: data[0],
                types: data[1],
                functions: data[2],
                typeToFunction: JSON.stringify(Object.fromEntries(typeToFunctionMap))
             });
        })
    });

    //Success page when device has been successfully added
    app.post("/device-added", (req,res)=>{
        console.log("Here is where we will save the data in the database");
        
        console.log(req.body);
        res.render("device-added.ejs",{

        });
    })
}