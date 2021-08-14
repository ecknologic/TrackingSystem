var express = require('express');
const auditQueries = require('../dbQueries/auditlogs/queries.js');
const vendorQueries = require('../dbQueries/vendors/queries.js');
const { decryptObj } = require('../utils/crypto.js');
var router = express.Router();
const { dbError } = require('../utils/functions.js');
const { compareVendorData } = require('./utils/vendor.js');
let departmentId, userId, userName, userRole;

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  departmentId = req.headers['departmentid']
  userId = req.headers['userid']
  userName = req.headers['username']
  userRole = req.headers['userrole']
  next();
});

router.post('/createVendor', (req, res) => {
  vendorQueries.saveVendor(req.body, (err, results) => {
    if (err) res.status(500).json(dbError(err));
    else {
      auditQueries.createLog({ userId, description: `Vendor created by ${userRole} <b>(${userName})</b>`, genericId: results.insertId, type: "vendor" })
      res.json(results)
    }
  })
});

router.get('/getvendors', (req, res) => {
  vendorQueries.getVendors((err, results) => {
    if (err) res.status(500).json(dbError(err));
    else res.json(results)
  })
})

router.get('/getVendorById/:vendorId', (req, res) => {
  vendorQueries.getVendorById(req.params.vendorId, async (err, results) => {
    if (err) res.status(500).json(dbError(err));
    else {
      if (results.length) {
        let { accountNumber, ifscCode, bankName, branchName } = results[0]
        let decryptedData = await decryptObj({ accountNumber, ifscCode, bankName, branchName })
        results = [{ ...results[0], accountNumber: decryptedData.accountNumber, ifscCode: decryptedData.ifscCode, bankName: decryptedData.bankName, branchName: decryptedData.branchName }]
        return res.json(results)
      }
      res.json(results)
    }
  })
})

router.post('/updateVendor', async (req, res) => {
  let logs = await compareVendorData({ vendorName, contactPerson, address, gstNo, customerName, accountNumber, ifscCode, bankName, branchName, creditPeriod, itemsSupplied, remarks }, { vendorId: req.body.vendorId, userId, userName, userRole })
  vendorQueries.updateVendor(req.body, (err, results) => {
    if (err) res.status(500).json(dbError(err));
    else {
      if (logs.length) {
        auditQueries.createLog(logs, (err, data) => {
          if (err) console.log('log error', err)
          else console.log('log data', data)
        })
      }
      res.json(results)
    }
  })
});

module.exports = router;
