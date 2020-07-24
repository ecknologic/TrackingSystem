var express = require('express');
var router = express.Router();
const db = require('../config/db.js');

//Middle ware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});


/**
* @swagger
* /motherPlant/getQualityControl:
*   get:
*     tags:
*       - Warehouse
*     description: Getting Quality control details
*     produces:
*       - application/json
*     responses:
*       200:
*         description: Successfully 
*/

router.get('/getQualityControl', (req, res) => {
    let query = "select * from qualitycontrol";
    let result = db.query(query, (err, results) => {

        if (err) throw err;

        res.send(JSON.stringify(results));


    });
});

router.post('/createQC', (req, res) => {
    let CreateQuery = "insert into qualitycontrol (reportdate,batchNo,testType,reportImage) values(?,?,?,?)";

    console.log(req.body);

    let input = req.body;

    let insertQueryValues = [input.reportdate, input.batchNo, input.testType, input.reportImage]
    db.query(CreateQuery, insertQueryValues, (err, results) => {

        console.log(insertQueryValues);

        if (err) throw err;
        else
            res.send("Record Inserted");

    });
})

/**
* @swagger
* /motherPlant/getRMDetails:
*   get:
*     tags:
*       - Warehouse
*     description: Getting Required Raw Materials details
*     produces:
*       - application/json
*     responses:
*       200:
*         description: Successfully 
*/

router.get('/getRMDetails', (req, res) => {
    let query = "select * from requiredrawmaterial";
    let result = db.query(query, (err, results) => {

        if (err) throw err;

        res.send(JSON.stringify(results));


    });
});
router.post('/createRM', (req, res) => {
    let CreateQuery = "insert into requiredrawmaterial (itemName,description,recordLevel) values(?,?,?)";

    console.log(req.body);

    let input = req.body;

    let insertQueryValues = [input.itemName, input.description, input.recordLevel]
    db.query(CreateQuery, insertQueryValues, (err, results) => {

        console.log(insertQueryValues);

        if (err) throw err;
        else
            res.send("Record Inserted");

    });
})
module.exports = router;