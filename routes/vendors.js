var express = require('express');
const vendorQueries = require('../dbQueries/vendors/queries.js');
const { decryptObj } = require('../utils/crypto.js');
var router = express.Router();
const { dbError } = require('../utils/functions.js');

router.post('/createVendor', (req, res) => {
  vendorQueries.saveVendor(req.body, (err, results) => {
    if (err) res.status(500).json(dbError(err));
    else res.json(results)
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

router.post('/updateVendor', (req, res) => {
  vendorQueries.updateVendor(req.body, (err, results) => {
    if (err) res.status(500).json(dbError(err));
    else res.json(results)
  })
});

module.exports = router;
