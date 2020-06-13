const mysql = require('mysql');

const config=require('./config.js');

const conn = mysql.createConnection({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.dbName
  });


const pool = mysql.createPool({
    connectionLimit : 10,
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.dbName
  });


//connect to database
/* conn.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connected...');
}); */


//connect to database using pool
pool.getConnection((err) =>{
  if(err) throw err;
  console.log('Mysql Connected using pool...');
});


//module.exports=conn;
module.exports = pool;
