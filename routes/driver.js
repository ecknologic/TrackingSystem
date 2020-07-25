var express = require('express');
var router = express.Router();
const db = require('../config/db.js');

//Middle ware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});


router.get('/getOrderDetails/:date', (req, res) => {
    var date = req.params.date;
    console.log(date);

    let query = "select * from orderdetails  WHERE DATE(`deliveryDate`) ='" + date + "'";
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
    db.query(updateQuery, [1, orderId], (err, results) => {

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

        res.send(JSON.stringify(results));
    });
});
module.exports = router;