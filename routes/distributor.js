var express = require('express');
var router = express.Router();
const distributorQueries = require('../dbQueries/distributor/queries.js');
const { dbError } = require('../utils/functions.js');
const { UPDATEMESSAGE } = require('../utils/constants');

router.get('/getDistributors', (req, res) => {
    distributorQueries.getDistributors((err, results) => {
        if (err) res.status(500).json(dbError(err));
        else res.send(results);
    });
});
router.get('/getDistributorsList', (req, res) => {
    distributorQueries.getDistributorsList((err, results) => {
        if (err) res.status(500).json(dbError(err));
        else res.send(results);
    });
});
router.get('/getDistributor/:distributorId', (req, res) => {
    const { distributorId } = req.params
    distributorQueries.getDistributorById(distributorId, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else res.send(results);
    });
});

router.post("/createDistributor", (req, res) => {
    distributorQueries.createDistributor(req.body, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
            res.json(results)
        }
    })
});
router.post("/updateDistributor", (req, res) => {
    distributorQueries.updateDistributor(req.body, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else res.json(UPDATEMESSAGE)
    })
});
module.exports = router;
