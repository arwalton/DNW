const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'locathost',
    user: 'midterm',
    password: '%wqAWjXEZtJBq@Pa@S86',
    databast: 'mySmartHome'
});

connection.connect((err)=>{
    if(err){
        throw error;
    }else{
        console.log('MySQL database connected');
    }
});

module.exports = connection;