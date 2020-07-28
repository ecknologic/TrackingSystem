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
        if (err) throw err;
        else {
            if (req.query.qrcode == String(results[0].adharNo) + String(results[0].mobileNumber)) res.send('Success')
            else res.send('Invalid')
        }
    });
});
router.get('/getOrderDetails/:date', (req, res) => {
    var date = req.params.date;
    console.log(date);

    // let query = "select * from orderdetails  WHERE DATE(`deliveryDate`) ='" + date + "'";
    let query = "SELECT orderdetails.orderid,orderdetails.ordertype,orderdetails.itemsCount,orderdetails.damagedCount,orderdetails.isDelivered,orderdetails.transactionid,orderdetails.returnEmptyCans,orderdetails.deliveryDate,customerdetails.customerName,customerdetails.Address1,customerdetails.Address2,customerdetails.latitude,customerdetails.longitude,customerdetails.mobileNumber FROM orderdetails INNER JOIN customerdetails  ON orderdetails.customerId = customerdetails.customerId WHERE DATE(`deliveryDate`) ='" + date + "'"
    let result = db.query(query, (err, results) => {

        if (err) throw err;

        res.send(JSON.stringify(results));


    });
});

router.post('/addDamagedStock', (req, res) => {
    var orderId = req.body.orderId;
    var damagedStockCount = req.body.damagedStockCount;
    let updateQuery = "update orderdetails set damagedCount=? where orderid=?"
    db.query(updateQuery, [damagedStockCount, orderId], (err, results) => {

        if (err) throw err;
        else
            res.send('record updated');
    });

});

router.post('/addReturnEmptyCans', (req, res) => {
    var orderId = req.body.orderId;
    var returnEmptyCans = req.body.returnEmptyCans;
    let updateQuery = "update orderdetails set returnEmptyCans=? where orderid=?"
    db.query(updateQuery, [returnEmptyCans, orderId], (err, results) => {
        if (err) throw err;
        else
            res.send('record updated');
    });
});
router.post('/updateDeliveryStatus/:orderId', (req, res) => {
    var orderId = req.params.orderId;
    let updateQuery = "update orderdetails set isDelivered=? where orderid=?"
    db.query(updateQuery, [req.body.status, orderId], (err, results) => {

        if (err) throw err;
        else
            res.send('record updated');
    });
});

router.get("/customerOrderDetails/:orderId", (req, res) => {
    var orderId = req.params.orderId;

    let customerOrderDetailsQuery = "SELECT cd.*,o.orderId,o.*,GROUP_CONCAT(p.productName,':',cp.noOfJarsTobePlaced SEPARATOR ';') AS customerproducts " +
        " FROM customerdetails  cd INNER JOIN customerproductdetails cp ON cd.customerId=cp.customerId INNER JOIN" +
        " productdetails p ON p.productId=cp.productId INNER JOIN orderdetails o ON o.customerId=cp.customerId WHERE o.orderid=?";

    let result = db.query(customerOrderDetailsQuery, [orderId], (err, results) => {
        if (err) throw err;
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