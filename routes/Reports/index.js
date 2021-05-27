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
  reportsQueries.getNewCustomerBTDetails(req.query, (err, results) => {
    if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
    else res.json(results)
  })
})

router.get('/getEnquiriesCount', (req, res) => {
  reportsQueries.getEnquiriesCountBySalesAgent(req.query, (err, results) => {
    if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
    else res.json(results)
  })
})

router.get('/getVisitedCustomersReport', (req, res) => {
  reportsQueries.getVisitedCustomersReport(req.query, (err, results) => {
    if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
    else {
      reportsQueries.getVisitedCustomersReportByStatus(req.query, (err, results1) => {
        if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
        else {
          let onboardedCustomers = 0, pendingApprovals = 0
          if (results1.length) {
            if (results1[0].isApproved == 1) {
              onboardedCustomers = results1[0].customersCount
              pendingApprovals = results1[1].customersCount
            } else {
              pendingApprovals = results1[0].customersCount
              onboardedCustomers = results1[1].customersCount
            }
          }
          res.json({ ...results[0], onboardedCustomers, pendingApprovals })
        }
      })
    }
  })
})


module.exports = router;
