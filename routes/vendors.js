var express = require('express');
const vendorQueries = require('../dbQueries/vendors/queries.js');
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
  vendorQueries.getVendorById(req.params.vendorId, (err, results) => {
    if (err) res.status(500).json(dbError(err));
    else res.json(results)
  })
})

router.post('/updateVendor', (req, res) => {
  vendorQueries.updateVendor(req.body, (err, results) => {
    if (err) res.status(500).json(dbError(err));
    else res.json(results)
  })
});

module.exports = router;
