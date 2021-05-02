var express = require('express');
var router = express.Router();
const distributorQueries = require('../dbQueries/distributor/queries.js');
const { dbError, saveProductDetails, customerProductDetails, updateProductDetails } = require('../utils/functions.js');
const { UPDATEMESSAGE, DISTRIBUTOR } = require('../utils/constants');
const auditQueries = require('../dbQueries/auditlogs/queries.js');
let userId;

router.use(function timeLog(req, res, next) {
    userId = req.headers['userid']
    next();
});

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
        else if (results.length) {
            customerProductDetails(distributorId, DISTRIBUTOR).then(products => {
                results[0].products = products
                res.send(results);
            })
        }
        else res.json("Distributor not Found")
    });
});

router.post("/createDistributor", (req, res) => {
    const { products, deliveryDetailsId } = req.body
    distributorQueries.createDistributor(req.body, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
            saveProductDetails({ products, deliveryDetailsId, distributorId: results.insertId, customerType: "distributor" }).then(result => {
                auditQueries.createLog({ userId, description: `Distributor created`, customerId: results.insertId, type: "distributor" })
                res.json(result)
            })
        }
    })
});
router.post("/updateDistributor", (req, res) => {
    const { products } = req.body;
    distributorQueries.updateDistributor(req.body, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
            updateProductDetails(products).then(result => {
                auditQueries.createLog({ userId, description: `Distributor Updated`, customerId: req.body.distributorId, type: "distributor" })
                res.json(UPDATEMESSAGE)
            })
        }
    })
});
router.put('/updateDistributorStatus', (req, res) => {
    const { distributorId, status } = req.body
    distributorQueries.updateDistributorStatus(req.body, (err, results) => {
        if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
        else {
            auditQueries.createLog({ userId, description: `Distributor status changed to ${status == 1 ? 'Active' : 'Draft'}`, customerId: distributorId, type: "distributor" })
            res.json(results);
        }
    });
});
router.delete('/deleteDistributor/:distributorId', (req, res) => {
    const { distributorId } = req.params
    distributorQueries.deleteDistributor(distributorId, (err, results) => {
        if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
        else {
            auditQueries.createLog({ userId, description: `Distributor Deleted`, customerId: distributorId, type: "distributor" })
            res.json(results);
        }
    });
});
module.exports = router;
