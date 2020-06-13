const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const config=require('./config/config.js');

const dbConnection = mysql.createConnection({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.dbName
  });

  //connect to database
 dbConnection.connect((err) =>{
    if(err) throw err;
    console.log('Mysql Connected...');
  });