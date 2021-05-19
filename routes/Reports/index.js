var express = require('express');
var router = express.Router();
const reportsQueries = require('../../dbQueries/reports/index.js');
let userId, adminUserName, userRole;

router.use(function timeLog(req, res, next) {
  userId = req.headers['userid']
  adminUserName = req.headers['username']
  userRole = req.headers['userrole']
  next();
});

router.get('/getNewCustomerBT', (req, res) => {
  reportsQueries.getNewCustomerBTDetails((err, results) => {
    if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
    else res.json(results)
  })
})

router.get('/getEnquiriesCount', (req, res) => {
  reportsQueries.getEnquiriesCountBySalesAgent((err, results) => {
    if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
    else res.json(results)
  })
})

module.exports = router;
