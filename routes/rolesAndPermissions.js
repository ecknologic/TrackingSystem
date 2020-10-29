var express = require('express');
var router = express.Router();
const db = require('../config/db.js')



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

router.get('/getDepartments/:deptType',(req,res)=>{
  var deptType = req.params.deptType;
  let query="select * from departmentmaster where DepartmentType=?"
  let result = db.query(query,[deptType], (err, results) => {
    if (err) res.send(err);
    res.send(JSON.stringify(results));
  });

})

module.exports = router;
