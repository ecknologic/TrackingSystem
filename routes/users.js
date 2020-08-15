var express = require('express');
var router = express.Router();
const db = require('../config/db.js')
var bcrypt = require("bcryptjs");

router.post('/createUser', (req, res) => {
  // Generates hash using bCrypt
  var createHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
  }
  let query = "insert into usermaster (userName,roleId,emailid,password) values(?,?,?,?)";
  let userDetails = req.body;
  let insertQueryValues = [userDetails.userName, userDetails.roleId, userDetails.emailid, createHash(userDetails.password)]
  db.query(query, insertQueryValues, (err, results) => {
    if (err) res.send(err);
    else {
      for (let i of userDetails.privilegeDetails) {
        let privilegeQuery = "insert into userPrivilegesMaster (privilegeId,privilegeActions,userId) values(?,?,?)";
        let queryValues = [i.privilegeId, i.privilegeActions.join(), results.insertId]
        db.query(privilegeQuery, queryValues, (err, results) => {
          console.log(queryValues);
          if (err) res.send(err);
          else {
            res.send("record inserted");
          }
        })
      }
    }
  });
});

router.post('/updateUser', (req, res) => {
  let query = "UPDATE usermaster SET userName=?,roleId=?,emailid=? where userId=?";
  let userDetails = req.body;
  let insertQueryValues = [userDetails.userName, userDetails.roleId, userDetails.emailid, userDetails.userId]
  db.query(query, insertQueryValues, (err, results) => {
    if (err) res.send(err);
    else {
      for (let i of userDetails.privilegeDetails) {
        let privilegeQuery = "UPDATE userPrivilegesMaster SET privilegeActions=? where privilegeId=? AND userId=?";
        let queryValues = [i.privilegeActions.join(), i.privilegeId, userDetails.userId]
        db.query(privilegeQuery, queryValues, (err, results) => {
          console.log(queryValues);
          if (err) res.send(err);
          else {
            res.send("record updated")
          }
        })
      }
    }
  });
});

router.post('/updatePassword', (req, res) => {
  // Generates hash using bCrypt
  var createHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
  }
  let query = "Update usermaster set password=? where userId=?";
  let userDetails = req.body;
  let updateQueryValues = [createHash(userDetails.password), userDetails.userId]
  db.query(query, updateQueryValues, (err, results) => {
    if (err) res.send(err);
    else {
      res.send("Password updated")
    }
  });
});



module.exports = router;
