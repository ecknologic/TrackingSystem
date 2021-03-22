var express = require('express');
var router = express.Router();
const distributorQueries = require('../dbQueries/distributor/queries.js');
const { dbError, saveProductDetails, customerProductDetails, updateProductDetails } = require('../utils/functions.js');
const { UPDATEMESSAGE, DISTRIBUTOR } = require('../utils/constants');

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
            saveProductDetails({ products, deliveryDetailsId, customerId: results.insertId, customerType: "distributor" }).then(result => {
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
                res.json(UPDATEMESSAGE)
            })
        }
    })
});
router.put('/updateDistributorStatus', (req, res) => {
    distributorQueries.updateDistributorStatus(req.body, (err, results) => {
        if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
        else res.json(results);
    });
});
router.delete('/deleteDistributor/:distributorId', (req, res) => {
    distributorQueries.deleteDistributor(req.params.distributorId, (err, results) => {
        if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
        else res.json(results);
    });
});
module.exports = router;
