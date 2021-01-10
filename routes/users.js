var express = require('express');
var router = express.Router();
const db = require('../config/db.js')
var bcrypt = require("bcryptjs");

router.post('/createWebUser', (req, res) => {
  // Generates hash using bCrypt
  var createHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
  }
  let query = "insert into usermaster (userName,roleId,emailid,password,departmentId,mobileNumber,joinedDate,parentName,gender,dob,aadharNo,address,permanentAddress) values(?,?,?,?,?,?,?,?,?,?,?,?,?)";
  let userDetails = req.body;
  const { userName, roleId, emailid, password = "Bibo@123", privilegeDetails = [], departmentId, mobileNumber, joinedDate, parentName, gender, dob, aadharNo, address, permanentAddress } = req.body
  let insertQueryValues = [userName, roleId, emailid, createHash(password), departmentId, mobileNumber, joinedDate, parentName, gender, dob, aadharNo, address, permanentAddress]
  db.query(query, insertQueryValues, (err, results) => {
    if (err) res.json({ status: 200, message: err });
    else {
      let updateQuery = 'UPDATE usermaster SET loginId=? WHERE userId=?';
      let idValue = userName.substring(0, 3) + results.insertId
      let updateValues = [idValue, results.insertId];
      db.query(updateQuery, updateValues, (updateErr, updateResults) => {
        if (updateErr) console.log(updateErr);
      })
      if (privilegeDetails.length) {
        for (let i of privilegeDetails) {
          let privilegeQuery = "insert into userPrivilegesMaster (privilegeId,privilegeActions,userId) values(?,?,?)";
          let queryValues = [i.privilegeId, i.privilegeActions.join(), results.insertId]
          db.query(privilegeQuery, queryValues, (privilegeErr, results) => {
            if (privilegeErr) res.json({ status: 500, message: privilegeErr });
            else {
              res.json({ status: 200, message: "User Added Successfully" });
            }
          })
        }
      } else res.json({ status: 200, message: "User Added Successfully" });
    }
  });
});
router.get('/getUsers', (req, res) => {
  let query = "SELECT userId,userName,RoleId,emailid,mobileNumber from usermaster ORDER BY createdDateTime DESC";
  db.query(query, (err, results) => {
    if (err) res.json(err);
    else res.json(results)
  })
})
router.get('/getUsersBydepartmentType/:departmentType', (req, res) => {
  let query = "SELECT u.userId,u.userName,u.emailid,u.mobileNumber,r.RoleName as role from usermaster u INNER JOIN rolemaster r on u.RoleId=r.RoleId ORDER BY createdDateTime DESC";
  db.query(query, (err, results) => {
    if (err) res.json(err);
    else res.json(results)
  })
})
router.get('/getUser/:userId', (req, res) => {
  let query = "SELECT userId,userName,RoleId,emailid,mobileNumber from usermaster where userId=" + req.params.userId;
  db.query(query, (err, results) => {
    if (err) res.json(err);
    else res.json(results)
  })
})
router.post('/updateWebUser', (req, res) => {
  let query = "UPDATE usermaster SET userName=?,roleId=?,emailid=?, mobileNumber=?, joinedDate=?, parentName=?, gender=?, dob=?, aadharNo=?, address=?, permanentAddress=?  where userId=?";
  let userDetails = req.body;
  const { userName, roleId, emailid, mobileNumber, userId, joinedDate, parentName, gender, dob, aadharNo, address, permanentAddress } = req.body
  let insertQueryValues = [userName, roleId, emailid, mobileNumber, joinedDate, parentName, gender, dob, aadharNo, address, permanentAddress,userId]
  db.query(query, insertQueryValues, (err, results) => {
    if (err) res.send(err);
    else {
      for (let i of userDetails.privilegeDetails) {
        let privilegeQuery = "UPDATE userPrivilegesMaster SET privilegeActions=? where privilegeId=? AND userId=?";
        let queryValues = [i.privilegeActions.join(), i.privilegeId, userDetails.userId]
        db.query(privilegeQuery, queryValues, (err, results) => {
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
