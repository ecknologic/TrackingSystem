var express = require('express');
var router = express.Router();
const db = require('../config/db.js')
var bcrypt = require("bcryptjs");
const usersQueries = require('../dbQueries/users/queries.js');
const { dbError } = require('../utils/functions.js');

router.post('/createWebUser', (req, res) => {
  // Generates hash using bCrypt
  var createHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
  }
  let query = "insert into usermaster (userName,roleId,emailid,password,departmentId,mobileNumber,joinedDate,parentName,gender,dob,adharNo,address,permanentAddress,adhar_frontside,adhar_backside) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
  const { userName, roleId, emailid, password = "Bibo@123", privilegeDetails = [], departmentId, mobileNumber, joinedDate, parentName, gender, dob, adharNo, address, permanentAddress, adharProof } = req.body
  let adhar_frontside = Buffer.from(adharProof.Front.replace(/^data:image\/\w+;base64,/, ""), 'base64')
  let adhar_backside = Buffer.from(adharProof.Back.replace(/^data:image\/\w+;base64,/, ""), 'base64')
  let insertQueryValues = [userName, roleId, emailid, createHash(password), departmentId, mobileNumber, joinedDate, parentName, gender, dob, adharNo, address, permanentAddress, adhar_frontside, adhar_backside]
  db.query(query, insertQueryValues, (err, results) => {
    if (err) res.status(500).json(dbError(err));
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
            if (privilegeErr) res.status(500).json(dbError(privilegeErr));
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
  usersQueries.getUsers((err, results) => {
    if (err) res.json(err);
    else res.json(results)
  })
})
router.get('/getUsersBydepartmentType/:departmentType', (req, res) => {
  usersQueries.getUsersBydepartmentType(req.params.departmentType, (err, results) => {
    if (err) res.json(err);
    else res.json(results)
  })
})
router.get('/getUser/:userId', (req, res) => {
  usersQueries.getUsersById(req.params.userId, (err, results) => {
    if (err) res.json(err);
    else res.json(results)
  })
})
router.post('/updateWebUser', (req, res) => {
  let query = "UPDATE usermaster SET userName=?,roleId=?,emailid=?, mobileNumber=?, joinedDate=?, parentName=?, gender=?, dob=?, adharNo=?, address=?, permanentAddress=?,adhar_frontside=?,adhar_backside=?  where userId=?";
  let userDetails = req.body;
  const { userName, roleId, emailid, mobileNumber, userId, joinedDate, parentName, gender, dob, adharNo, address, permanentAddress, adharProof } = req.body
  let adhar_frontside = Buffer.from(adharProof.Front.replace(/^data:image\/\w+;base64,/, ""), 'base64')
  let adhar_backside = Buffer.from(adharProof.Back.replace(/^data:image\/\w+;base64,/, ""), 'base64')
  let insertQueryValues = [userName, roleId, emailid, mobileNumber, joinedDate, parentName, gender, dob, adharNo, address, permanentAddress, adhar_frontside, adhar_backside, userId]
  db.query(query, insertQueryValues, (err, results) => {
    if (err) res.send(err);
    else {
      // for (let i of userDetails.privilegeDetails) {
      //   let privilegeQuery = "UPDATE userPrivilegesMaster SET privilegeActions=? where privilegeId=? AND userId=?";
      //   let queryValues = [i.privilegeActions.join(), i.privilegeId, userDetails.userId]
      //   db.query(privilegeQuery, queryValues, (err, results) => {
      //     if (err) res.send(err);
      //     else {
      res.send("record updated")
      // }
      // })
      // }
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
