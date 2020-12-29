var express = require('express');
var router = express.Router();
const db = require('../config/db.js');

//Middle ware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});


router.get('/validateQRCode', (req, res) => {
    let query = "select mobileNumber,adharNo from customerdetails  WHERE customerId =" + req.query.customerId;
    let result = db.query(query, (err, results) => {
        if (err) res.send(err);
        else {
            if (req.query.qrcode == String(results[0].adharNo) + String(results[0].mobileNumber)) res.send('Success')
            else res.send('Invalid')
        }
    });
});
router.get('/getOrderDetails/:date', (req, res) => {
    var date = req.params.date;
    console.log(date);

    // let query = "SELECT c.customerOrderId,c.damagedCount,c.isDelivered,c.dcNo,c.returnEmptyCans,c.deliveryDate,cd.customerName,cd.Address1,cd.Address2,cd.latitude,cd.longitude,cd.mobileNumber FROM customerorderdetails c INNER JOIN customerdetails cd ON c.existingCustomerId = cd.customerId WHERE DATE(`deliveryDate`) ='" + date + "'"
    let query = "SELECT c.customerOrderId,c.damagedCount,c.isDelivered,c.dcNo,c.returnEmptyCans,c.deliveryDate,c.customerName,c.address,c.latitude,c.longitude,c.phoneNumber FROM customerorderdetails c  WHERE DATE(`deliveryDate`) ='" + date + "'"
    let result = db.query(query, (err, results) => {

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
    let updateQuery = "update customerorderdetails set isDelivered=? where customerOrderId=?"
    db.query(updateQuery, [req.body.status, orderId], (err, results) => {

        if (err) res.send(err);
        else
            res.send('record updated');
    });
});

router.get("/customerOrderDetails/:orderId", (req, res) => {
    var orderId = req.params.orderId;

    let customerOrderDetailsQuery = "SELECT cd.*,c.customerOrderId,c.*,GROUP_CONCAT(cp.productName,':',cp.noOfJarsTobePlaced SEPARATOR ';') AS customerproducts " +
        " FROM customerdetails  cd INNER JOIN customerproductdetails cp ON cd.customerId=cp.customerId INNER JOIN" +
        "  customerorderdetails c ON c.existingCustomerId=cp.customerId WHERE c.customerOrderId=?";

    let result = db.query(customerOrderDetailsQuery, [orderId], (err, results) => {
        if (err) res.send(err);
        else {
            let arr = [];
            if (results.length) {
                for (let i of results) {
                    let obj = {
                        "customerId": i.customerId,
                        "customerName": i.customerName,
                        "mobileNumber": i.mobileNumber,
                        "AlternatePhNo": i.AlternatePhNo,
                        "EmailId": i.EmailId,
                        "Address1": i.Address1,
                        "Address2": i.Address2,
                        "contactperson": i.contactperson,
                        "orderid": i.orderid,
                        "isDelivered": i.isDelivered,
                        "transactionid": i.transactionid,
                        "deliveryDate": i.deliveryDate,
                        "customerproducts": i.customerproducts
                    }
                    arr.push(obj)
                }
                res.send(JSON.stringify(arr));
            } else {
                res.send(JSON.stringify(results));
            }
        }
    });
});
module.exports = router;