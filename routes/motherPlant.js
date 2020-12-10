var express = require('express');
var router = express.Router();
const db = require('../config/db.js');

//Middle ware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});



router.get('/getQualityControl', (req, res) => {
    let query = "select * from qualitycontrol";
    let result = db.query(query, (err, results) => {

        if (err) res.send(err);

        res.send(JSON.stringify(results));


    });
});

router.post('/createQC', (req, res) => {
    let CreateQuery = "insert into qualitycontrol (reportdate,batchNo,testType,reportImage,description) values(?,?,?,?,?)";
    let input = req.body;
    let reportImage = Buffer.from(input.reportImage.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let insertQueryValues = [input.reportdate, input.batchNo, input.testType, reportImage, input.description]
    db.query(CreateQuery, insertQueryValues, (err, results) => {
        console.log(insertQueryValues);
        if (err) res.send(err);
        else
            res.send("Record Inserted");
    });
})
router.get('/getInternalQualityControl', (req, res) => {
    let query = "select * from internalqualitycontrol";
    db.query(query, (err, results) => {
        if (err) res.send(err);
        res.json(results);
    });
});
router.post('/createInternalQC', (req, res) => {
    let CreateQuery = "insert into internalqualitycontrol (productionDate,batchNo,testType,description) values(?,?,?,?,?)";
    let input = req.body;
    let insertQueryValues = [input.productionDate, input.batchNo, input.testType, input.description]
    db.query(CreateQuery, insertQueryValues, (err, results) => {
        if (err) res.send(err);
        else
            res.send("Record Inserted");
    });
})

router.get('/getRMDetails', (req, res) => {
    let query = "select * from requiredrawmaterial";
    let result = db.query(query, (err, results) => {
        if (err) res.send(err);
        res.send(JSON.stringify(results));
    });
});

router.post('/createRM', (req, res) => {
    let CreateQuery = "insert into requiredrawmaterial (itemName,description,recordLevel,minOrderLevel) values(?,?,?,?)";
    let input = req.body;

    let insertQueryValues = [input.itemName, input.description, input.recordLevel, input.minOrderLevel]
    db.query(CreateQuery, insertQueryValues, (err, results) => {
        if (err) res.send(err);
        else
            res.send("Record Inserted");
    });
})
router.get('/getRMReceipt', (req, res) => {
    let query = "select * from rawmaterialreceipt";
    db.query(query, (err, results) => {
        if (err) res.send(err);
        res.send(JSON.stringify(results));
    });
});

router.post('/createRMReceipt', (req, res) => {
    let CreateQuery = "insert into rawmaterialreceipt (receiptdate,receivedFromParty,invoiceNo,itemreceived,price,qtyReceived,tax,invoiceValue,rawmaterialId,invoiceDate) values(?,?,?,?,?,?,?,?,?,?)";
    let input = req.body;
    let insertQueryValues = [input.receiptdate, input.receivedFromParty, input.invoiceNo, input.itemreceived, input.price, input.qtyReceived, input.tax, input.invoiceValue, input.rawmaterialId, input.invoiceDate]
    db.query(CreateQuery, insertQueryValues, (err, results) => {
        if (err) res.send(err);
        else
            res.send("Record Inserted");
    });
})

router.get('/getDispatchDetails', (req, res) => {
    let query = "select * from dispatches";
     db.query(query, (err, results) => {
        if (err) res.send(err);
        res.send(JSON.stringify(results));
    });
});

router.post('/addDispatchDetails', (req, res) => {
    let CreateQuery = "insert into dispatches (dispatchId,dispatchedDate,DCNO,vehicleNo,driverName,dispatchTo,itemDispatched,qtyDispatched,batchNo) values(?,?,?,?,?,?,?,?,?)";
    let input = req.body;
    let insertQueryValues = [input.dispatchId, input.dispatchedDate, input.DCNO, input.vehicleNo, input.driverName, input.dispatchTo, input.itemDispatched, input.qtyDispatched, input.batchNo]
    db.query(CreateQuery, insertQueryValues, (err, results) => {
        if (err) res.send(err);
        else
            res.send("Record Inserted");
    });
})

router.get('/getProductionDetails', (req, res) => {
    let query = "select * from production";
 db.query(query, (err, results) => {
        if (err) res.send(err);
        res.send(JSON.stringify(results));
    });
});

router.get('/getNatureOfBussiness', (req, res) => {
    let query = "SELECT SUBSTRING(COLUMN_TYPE,5) AS natureOfBussiness FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'customerorderdetails' AND COLUMN_NAME = 'isDelivered'";
     db.query(query, (err, results) => {
        if (err) res.send(err);
        res.send(JSON.stringify(results));
    });
});

router.get('/getVehicleDetails', (req, res) => {
    let query = "select * from vehicleDetails";
     db.query(query, (err, results) => {
        if (err) res.send(err);
        res.send(JSON.stringify(results));
    });
});

router.post('/addVehicleDetails', (req, res) => {
    let CreateQuery = "insert into VehicleDetails (vehicleNo,vehicleType) values(?,?)";
    let input = req.body;
    let insertQueryValues = [input.vehicleNo, input.vehicleType]
    db.query(CreateQuery, insertQueryValues, (err, results) => {
        if (err) res.send(err);
        else
            res.send("Record Inserted");
    });
})

router.post('/addProductionDetails', (req, res) => {
    let CreateQuery = "insert into production (productionDate,batchNo,phLevel,TDS,ozonelevel,qtyproduced,itemproduced) values(?,?,?,?,?,?,?)";
    let input = req.body;
    let insertQueryValues = [input.productionDate, input.batchNo, input.phLevel, input.TDS, input.ozonelevel, input.qtyproduced, input.itemproduced]
    db.query(CreateQuery, insertQueryValues, (err, results) => {
        if (err) res.send(err);
        else
            res.send("Record Inserted");
    });
})
module.exports = router;