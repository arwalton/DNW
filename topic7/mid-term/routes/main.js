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
        // Create sql query
        const functions = [];
        if(!req.body['on_off']){
            functions.push('on_off', 0);
        }else{
            functions.push('on_off', 1);
        }
        // Get device functions and values
        Object.keys(req.body).forEach(key => {
            if(key != 'device_name' && key != 'device_type' && key != 'on_off'){
                if(req.body[key] != ''){
                    functions.push(key, req.body[key]);
                }
            }
        });

        // Create sql query string to make new device
        let sqlQuery = "INSERT INTO devices (deviceName, typeId)" +
                        "VALUES (\""+ req.body.device_name +
                        "\",(SELECT typeId FROM types WHERE typeName=\"" + req.body.device_type +"\"));"
        
        //Create query strings to add device functions
        for(let i=0; i<functions.length; i+=2){
            sqlQuery += "INSERT INTO deviceToFunctionMap(deviceId, functionId, value) " +
                        "VALUES ((SELECT (deviceId) FROM devices WHERE deviceName = \'" + req.body.device_name + "\')," +
                        "(SELECT (functionId) FROM functions WHERE functionName = \'" + functions[i] + "\')," +
                        functions[i + 1]+ ");"
        }
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

    ////////////////////////////////////
    // Status-selector route
    app.get("/status-selector", (req,res)=>{
        // Query for existing devices
        let sqlQuery = "SELECT * FROM devices;";

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
            res.render("status-selector.ejs",{
                devices: data
            });
        });

    })

    ////////////////////////////////////
    // Device-status route
    app.get("/device-status", (req,res)=>{
        const deviceId = req.query.devices;
        // Query for requested device and associated functions
        let sqlQuery = "SELECT devices.deviceName, deviceToFunctionMap.value, functions.functionName " +
                    "FROM ((devices " +
                    "INNER JOIN deviceToFunctionMap " +
                    "ON devices.deviceId = deviceToFunctionMap.deviceId) " +
                    "INNER JOIN functions " + 
                    "ON deviceToFunctionMap.functionId = functions.functionId) " +
                    "WHERE devices.deviceId = " + deviceId + ";";

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
            console.log(data)
            res.render("device-status.ejs",{
                functions: data
            });
        });
    })

    ///////////////////////////////////
    // Control device route
    app.get("/control-device", (req,res)=>{
        // Query for existing devices
        const sqlQuery = `SELECT devices.deviceName, deviceToFunctionMap.value, functions.functionName
                          FROM ((devices
                          INNER JOIN deviceToFunctionMap
                          ON devices.deviceId = deviceToFunctionMap.deviceId)
                          INNER JOIN functions
                          ON deviceToFunctionMap.functionId = functions.functionId);
                          SELECT * FROM functions;`
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

            // //Create a map for devices and functions
            const deviceToFunctionMap = new Map();

            data[0].forEach((device)=> {
                if(deviceToFunctionMap.has(device.deviceName)){
                    deviceToFunctionMap.set(device.deviceName, [...deviceToFunctionMap.get(device.deviceName),device.functionName]);
                }else{
                    deviceToFunctionMap.set(device.deviceName,[device.functionName]);
                }
            })

            res.render("control-device.ejs", {
                 devices: data[0],
                // types: data[1],
                 functions: data[1],
                // typeToFunction: JSON.stringify(Object.fromEntries(typeToFunctionMap))
                deviceToFunction: JSON.stringify(Object.fromEntries(deviceToFunctionMap))
             });
        })
    });

    ///////////////////////////////////////////
    //Success page when device has been successfully updated
    app.post("/device-updated", (req,res)=>{
        // Create sql query
        const functions = [];
        if(!req.body['on_off']){
            functions.push({functionName: 'on_off',
                            value: '0'});
        }else{
            functions.push({functionName: 'on_off',
                            value: '1'});
        }
        // Get device functions and values
        Object.keys(req.body).forEach(key => {
            if(key != 'device_name' && key != 'device_type' && key != 'on_off'){
                if(req.body[key] != ''){
                    functions.push({functionName: key, 
                                    value: req.body[key]});
                }
            }
        });
        console.log(functions);

        // Create SQL query to update each function of the device
        let sqlQuery = "";

        functions.forEach((func)=>{
            sqlQuery += `UPDATE deviceToFunctionMap
            SET value = ${func.value}
            WHERE deviceId = (
               SELECT deviceId 
               FROM devices
               WHERE deviceName="${req.body.device_name}")
           AND functionId = (
               SELECT functionId 
               FROM functions
               WHERE functionName="${func.functionName}");`
        })

        try{
        // Execute query
        db.query(sqlQuery,(err, result)=>{
            if(err){
                console.log("Error" + err)
                res.redirect("/");
            }else{
                res.render("device-updated.ejs");
            }
        })
        }catch(e){
            console.log("Error: " + e);
        } 
    })
    /////////////////////////////////////////////
    // Delete device page
    app.get("/delete-device", (req,res)=>{
        let sqlQuery = "SELECT * FROM devices;"

        try{
            // Execute query
            db.query(sqlQuery,(err, result)=>{
                if(err){
                    console.log("Error" + err)
                    res.redirect("/");
                }else{

                // Convert data to useable format
                const data = result.map(item =>{
                    let myStr = JSON.stringify(item);
                    let json = JSON.parse(myStr);
                    return json;
                })
                    res.render("delete-device.ejs", {
                        devices: data
                    });
                }
            })
        }catch(e){
                console.log("Error: " + e);
        } 
    })

    /////////////////////////////////////////////
    app.post("/device-deleted", (req,res)=>{
        let sqlQuery = `DELETE FROM devices WHERE deviceId=${req.body.devices};`

        try{
            // Execute query
            db.query(sqlQuery,(err, result)=>{
                if(err){
                    console.log("Error" + err)
                    res.redirect("/");
                }else{
                    res.render("device-deleted.ejs");
                }
            })
        }catch(e){
                console.log("Error: " + e);
        } 
    })
}