module.exports = (app) => {
    ////////////////////////////////////////
    // Home route
    app.get("/", (req,res)=>{
        res.render("index.ejs")
    });

    ////////////////////////////////////////
    // About page route
    app.get("/about", (req,res)=>{
        res.render("about.ejs")
    });

    ////////////////////////////////////////
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

    ///////////////////////////////////////////
    //Success page when device has been successfully added route
    app.post("/device-added", (req,res)=>{
        console.log("Here is where we will save the data in the database");
        console.log(req.body);
        const functions = [];
        if(!req.body['on_off']){
            functions.push('on_off', 0);
        }else{
            functions.push('on_off', 1);
        }
        Object.keys(req.body).forEach(key => {
            if(key != 'device_name' && key != 'device_type' && key != 'on_off'){
                if(req.body[key] != ''){
                    functions.push(key, req.body[key]);
                }
            }
        });

        let sqlQuery = "INSERT INTO devices (deviceName, typeId)" +
                        "VALUES (\""+ req.body.device_name +
                        "\",(SELECT typeId FROM types WHERE typeName=\"" + req.body.device_type +"\"));"
        
        for(let i=0; i<functions.length; i+=2){
            sqlQuery += "INSERT INTO deviceToFunctionMap(deviceId, functionId, value) " +
                        "VALUES ((SELECT (deviceId) FROM devices WHERE deviceName = \'" + req.body.device_name + "\')," +
                        "(SELECT (functionId) FROM functions WHERE functionName = \'" + functions[i] + "\')," +
                        functions[i + 1]+ ");"
        }
        console.log(sqlQuery);

        try{
        // Execute query
        db.query(sqlQuery,(err, result)=>{
            if(err){
                res.redirect(404, "/");
            }else{
            res.render("device-added.ejs");
            }
        })
        }catch(e){
            console.log("Error: " + e);
        } 
    })
}