var express = require('express');
var router = express.Router();
const db = require('../config/db.js');
const { getDepartmentsList } = require('../dbQueries/motherplant/index.js');



router.get('/getRoles', (req, res) => {
  let query = "select * from rolemaster";
  let result = db.query(query, (err, results) => {
    if (err) res.send(err);
    res.send(JSON.stringify(results));
  });
});

router.get('/getPrivileges', (req, res) => {
  let query = "select * from PrivilegesMaster";
  let result = db.query(query, (err, results) => {
    if (err) res.send(err);
    res.send(JSON.stringify(results));
  });
});


module.exports = router;
