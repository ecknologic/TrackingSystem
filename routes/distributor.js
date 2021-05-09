var express = require('express');
var router = express.Router();
const distributorQueries = require('../dbQueries/distributor/queries.js');
const { dbError, saveProductDetails, customerProductDetails } = require('../utils/functions.js');
const { UPDATEMESSAGE, DISTRIBUTOR } = require('../utils/constants');
const auditQueries = require('../dbQueries/auditlogs/queries.js');
const { compareDistributorData } = require('./utils/distributor.js');
const { compareProductsData } = require('./utils/customer.js');
const db = require('../config/db.js')
let userId, userName, userRole;

router.use(function timeLog(req, res, next) {
    userId = req.headers['userid'];
    userName = req.headers['username']
    userRole = req.headers['userrole']
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
                auditQueries.createLog({ userId, description: `Distributor created by ${userRole} <b>(${userName})</b>`, customerId: results.insertId, type: "distributor" })
                res.json(result)
            })
        }
    })
});
router.post("/updateDistributor", async (req, res) => {
    const { products, agencyName, contactPerson, mobileNumber, alternateNumber, address, mailId, alternateMailId, gstNo, gstProof, operationalArea, distributorId, deliveryLocation } = req.body;
    let data = { agencyName, contactPerson, mobileNumber, alternateNumber, address, mailId, alternateMailId, gstNo, gstProof, operationalArea, deliveryLocation }
    const logs = await compareDistributorData(data, { customerId: distributorId, userId, userRole, userName })
    distributorQueries.updateDistributor(req.body, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
            if (logs.length) {
                auditQueries.createLog(logs, (err, data) => {
                    if (err) console.log('log error', err)
                    else console.log('log data', data)
                })
            }
            updateProductDetails(products, { customerId: distributorId, userId, userRole, userName }).then(result => {
                // auditQueries.createLog({ userId, description: `Distributor Updated`, customerId: req.body.distributorId, type: "distributor" })
                res.json(UPDATEMESSAGE)
            })
        }
    })
});
const updateProductDetails = (products, { customerId, userId, userRole, userName }) => {
    return new Promise(async (resolve, reject) => {
        if (products.length) {
            let logs = [], count = 0;
            for (let i of products) {
                let productLog = await compareProductsData(i, { type: "distributor", customerId, userId, userRole, userName })
                logs.push(...productLog)
                let deliveryProductsQuery = "UPDATE customerproductdetails SET noOfJarsTobePlaced=?,productPrice=?,productName=? where id=" + i.productId;
                let updateQueryValues = [i.noOfJarsTobePlaced, i.productPrice, i.productName]
                db.query(deliveryProductsQuery, updateQueryValues, (err, results) => {
                    if (err) reject(err);
                    else {
                        count++
                        if (count == products.length) {
                            if (logs.length) {
                                auditQueries.createLog(logs, (err, data) => {
                                    if (err) console.log('log error', err)
                                    else console.log('log data', data)
                                })
                            }
                        }
                        resolve(results)
                    }
                });
            }
        }
    })
}
router.put('/updateDistributorStatus', (req, res) => {
    const { distributorId, status } = req.body
    distributorQueries.updateDistributorStatus(req.body, (err, results) => {
        if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
        else {
            auditQueries.createLog({ userId, description: `Distributor status changed to ${status == 1 ? 'Active' : 'Draft'} by ${userRole} <b>(${userName})</b>`, customerId: distributorId, type: "distributor" })
            res.json(results);
        }
    });
});
router.delete('/deleteDistributor/:distributorId', (req, res) => {
    const { distributorId } = req.params
    distributorQueries.deleteDistributor(distributorId, (err, results) => {
        if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
        else {
            auditQueries.createLog({ userId, description: `Distributor Deleted by ${userRole} <b>(${userName})</b>`, customerId: distributorId, type: "distributor" })
            res.json(results);
        }
    });
});
module.exports = router;
