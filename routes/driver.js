var express = require('express');
var router = express.Router();
const db = require('../config/db.js');
const auditQueries = require('../dbQueries/auditlogs/queries.js');
const driverQueries = require('../dbQueries/driver/queries.js');
const usersQueries = require('../dbQueries/users/queries.js');
const { dbError, createHash, prepareOrderResponseObj } = require('../utils/functions.js');
const { compareDriverData, compareDriverDependentDetails } = require('./utils/driver.js');
let userId, adminUserName, userRole;

//Middle ware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    userId = req.headers['userid']
    adminUserName = req.headers['username']
    userRole = req.headers['userrole']
    next();
});


router.get('/validateQRCode', (req, res) => {
    let query = "select mobileNumber,adharNo from customerdetails  WHERE customerId =" + req.query.customerId;
    let result = db.query(query, (err, results) => {
        if (err) res.send(err);
        else {
            if (req.query.qrcode == String(results[0].adharNo) + String(results[0].mobileNumber)) res.json({ status: 200, statusMessage: "Success" })
            else res.json({ status: 200, statusMessage: "Invalid" })
        }
    });
});
router.get('/getOrderDetails/:date', (req, res) => {
    var date = req.params.date;
    const { driverId, warehouseId } = req.query;
    // let query = "SELECT c.customerOrderId,c.damagedCount,c.isDelivered,c.dcNo,c.returnEmptyCans,c.deliveryDate,cd.customerName,cd.Address1,cd.Address2,cd.latitude,cd.longitude,cd.mobileNumber FROM customerorderdetails c INNER JOIN customerdetails cd ON c.existingCustomerId = cd.customerId WHERE DATE(`deliveryDate`) ='" + date + "'"
    let query = "SELECT c.customerOrderId,c.damagedCount,c.isDelivered,c.dcNo,c.returnEmptyCans,c.deliveryDate,c.customerName,c.address,c.latitude,c.longitude,c.phoneNumber FROM customerorderdetails c  WHERE DATE(`deliveryDate`) =? AND c.driverId=? AND c.warehouseId=? AND routeId != 'NULL' AND driverId != 'NULL'"
    let result = db.query(query, [date, driverId, warehouseId], (err, results) => {

        if (err) res.send(err);

        res.send(JSON.stringify(results));


    });
});

router.post('/addDamagedStock', (req, res) => {
    var orderId = req.body.orderId;
    var damagedStockCount = req.body.damagedStockCount;
    let updateQuery = "update customerorderdetails set damagedCount=? where customerOrderId=?"
    db.query(updateQuery, [damagedStockCount, orderId], (err, results) => {

        if (err) res.send(err);
        else
            res.send('record updated');
    });

});

router.post('/addReturnEmptyCans', (req, res) => {
    var orderId = req.body.orderId;
    var returnEmptyCans = req.body.returnEmptyCans;
    let updateQuery = "update customerorderdetails set returnEmptyCans=? where customerOrderId=?"
    db.query(updateQuery, [returnEmptyCans, orderId], (err, results) => {
        if (err) res.send(err);
        else
            res.send('record updated');
    });
});
router.post('/updateDeliveryStatus/:orderId', (req, res) => {
    var orderId = req.params.orderId;
    const { status, deliveryProducts, productsUpdated } = req.body
    driverQueries.updateDeliveryStatus({ status, orderId }, (err, results) => {
        if (err) res.send(err);
        else {
            if (productsUpdated == 'true') {
                driverQueries.updateDeliveryProducts({ deliveryProducts, orderId }, (updateErr, updated) => {
                    if (updateErr) res.send(updateErr);
                    else {
                        res.send('record updated');
                    }
                })
            }
            else res.send('record updated');
        }
    });
});

router.get("/customerOrderDetails/:orderId", (req, res) => {
    var orderId = req.params.orderId;
    driverQueries.getOrderDetailsByOrderId(orderId, (err, orderData) => {
        if (err) res.status(500).json(dbError(err));
        else if (orderData.length) {
            const { customerType } = orderData[0]
            let customerOrderDetailsQuery = "SELECT cd.customerId,cd.customerName as ownerName,c.customerOrderId,c.*,GROUP_CONCAT(cp.productName,':',cp.noOfJarsTobePlaced SEPARATOR ';') AS customerproducts " +
                " FROM customerdetails  cd LEFT JOIN customerproductdetails cp ON cd.customerId=cp.customerId INNER JOIN" +
                "  customerorderdetails c ON c.existingCustomerId=cd.customerId WHERE c.customerOrderId=?";

            if (customerType == 'distributor') {
                customerOrderDetailsQuery = "SELECT cd.distributorId as customerId,cd.operationalArea as deliveryLocation,cd.agencyName as ownerName,c.customerOrderId,c.*,GROUP_CONCAT(cp.productName,':',cp.noOfJarsTobePlaced SEPARATOR ';') AS customerproducts " +
                    " FROM Distributors  cd INNER JOIN customerproductdetails cp ON cd.distributorId=cp.distributorId INNER JOIN" +
                    "  customerorderdetails c ON c.distributorId=cp.distributorId WHERE c.customerOrderId=?";
            }
            db.query(customerOrderDetailsQuery, [orderId], (err, results) => {
                if (err) res.send(err);
                else {
                    let arr = [];
                    if (results.length) {
                        for (let i of results) {
                            let obj = prepareOrderResponseObj(i)
                            arr.push(obj)
                        }
                        res.send(JSON.stringify(arr));
                    } else {
                        res.send(JSON.stringify(results));
                    }
                }
            });
        } else {
            res.status(404).json("Order with this orderId not found")
        }
    })
});

router.get('/getDrivers', (req, res) => {
    driverQueries.getDrivers((err, results) => {
        if (err) res.json(dbError(err))
        else res.json(results)
    })
})

router.get('/getDriver/:driverId', (req, res) => {
    driverQueries.getDriverById(req.params.driverId, (err, results) => {
        if (err) res.json(dbError(err))
        else res.json(results)
    })
})

router.delete('/deleteDriver/:driverId', (req, res) => {
    const { driverId } = req.params
    driverQueries.deleteDriver(driverId, (err, results) => {
        if (err) res.json(dbError(err))
        else {
            auditQueries.createLog({ userId, description: "Driver Deleted", staffId: driverId, type: "driver" })
            res.json(results)
        }
    })
})

router.post('/createDriver', (req, res) => {
    let input = req.body;
    input.password = createHash("Bibo@123")
    driverQueries.createDriver(input, (err, results) => {
        if (err) res.status(500).json(dbError(err))
        else {
            let obj = { ...req.body.dependentDetails, userId: results.insertId }
            usersQueries.saveDependentDetails(obj, "driverDependentDetails", (err, success) => {
                if (err) console.log("Driver Dependent Err", err)
            })
            driverQueries.updateDriverLoginId({ driverName: req.body.userName, driverId: results.insertId }, (err, updated) => {
                if (err) console.log("Driver update Err", err)
            })
            auditQueries.createLog({ userId, description: `Driver created by ${userRole} <b>(${adminUserName})</b>`, staffId: results.insertId, type: "driver" })
            res.json(results)
        }
    })
})

router.put('/updateDriverStatus', (req, res) => {
    const { driverId, status } = req.body
    driverQueries.updateDriverActiveStatus(req.body, (err, results) => {
        if (err) res.json(err);
        else {
            auditQueries.createLog({ userId, description: `Driver status changed to ${status == 1 ? "Active" : "Draft"} by ${userRole} <b>(${adminUserName})</b>`, staffId: driverId, type: "driver" })
            res.json(results)
        }
    })
})

router.post('/updateDriver', async (req, res) => {
    const { userName, emailid, departmentId, mobileNumber, joinedDate, parentName, gender, dob, adharNo, address, permanentAddress, licenseNo, adhar_frontside, adhar_backside, license_frontside, license_backside, accountNo, bankName, branchName, ifscCode, recommendedBy, recruitedBy, driverId, dependentDetails, roleName, departmentName } = req.body
    let data = { userName, emailid, departmentId, mobileNumber, joinedDate, parentName, gender, dob, adharNo, address, permanentAddress, licenseNo, adhar_frontside, adhar_backside, license_frontside, license_backside, accountNo, bankName, branchName, ifscCode, recommendedBy, recruitedBy, roleName, departmentName }
    const logs = await compareDriverData(data, { userId, userRole, adminUserName, staffId: driverId })
    driverQueries.updateDriver(req.body, async (err, results) => {
        if (err) res.json(dbError(err))
        else {
            if (logs.length) {
                auditQueries.createLog(logs, (err, data) => {
                    if (err) console.log('log error', err)
                    else console.log('log data', data)
                })
            }
            if (dependentDetails) {
                const { name, dob, gender, adharProof, mobileNumber, relation, dependentId, adharNo } = dependentDetails
                const dependentlogs = await compareDriverDependentDetails({ name, dob, gender, adharProof, mobileNumber, relation, adharNo }, { userId, dependentId, userRole, adminUserName, staffId: driverId })
                usersQueries.updateDependentDetails(dependentDetails, "driverDependentDetails", (err, success) => {
                    if (err) console.log("Driver Dependent Err", err)
                    else {
                        if (dependentlogs.length) {
                            auditQueries.createLog(dependentlogs, (err, data) => {
                                if (err) console.log('log error', err)
                                else console.log('log data', data)
                            })
                        }
                    }
                })
            }
            res.json(results)
        }
    })
})

module.exports = router;