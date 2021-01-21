var express = require('express');
var router = express.Router();
const db = require('../config/db.js')
const multer = require('multer');
const distributorQueries = require('../dbQueries/distributor/queries.js');
const { dbError } = require('../utils/functions.js');
let departmentId;


//Middle ware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    departmentId = req.headers['departmentid'] || 1
    next();
});

router.get('/getDistributors', (req, res) => {
    distributorQueries.getDistributors((err, results) => {
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
        else res.json(results)
    })
});
module.exports = router;
