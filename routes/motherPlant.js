var express = require('express');
var router = express.Router();
const motherPlantDbQueries = require('../dbQueries/motherplant/queries');
const { dbError, getBatchId } = require('../utils/functions');

//Middle ware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});



router.get('/getQualityControl', (req, res) => {
    motherPlantDbQueries.getAllQCDetails((err, results) => {
        if (err) res.status(500).json(dbError(err));
        res.json(results);
    });
});

router.post('/createQC', (req, res) => {
    let input = req.body;
    motherPlantDbQueries.createQC(input, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else
            res.json("Record Inserted");
    });
})

router.get('/getInternalQualityControl', (req, res) => {
    motherPlantDbQueries.getInternalQualityControl((err, results) => {
        if (err) res.status(500).json(dbError(err));
        res.json(results);
    });
});

router.post('/createInternalQC', (req, res) => {
    let input = req.body;
    motherPlantDbQueries.createInternalQC(input, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else
            res.json("Record Inserted");
    });
})

router.get('/getRMDetails', (req, res) => {
    motherPlantDbQueries.getRMDetails((err, results) => {
        if (err) res.status(500).json(dbError(err));
        res.json(results);
    });
});

router.post('/createRM', (req, res) => {
    let input = req.body;
    motherPlantDbQueries.createRM(input, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else
            res.json("Record Inserted");
    });
})

router.get('/getRMReceipt', (req, res) => {
    motherPlantDbQueries.getRMReceiptDetails((err, results) => {
        if (err) res.status(500).json(dbError(err));
        res.json(results);
    });
});

router.post('/createRMReceipt', (req, res) => {
    let input = req.body;
    motherPlantDbQueries.createRMReceipt(input, (err, results) => {
        if (err) res.status(500).json(err.sqlMessage);
        else
            res.json("Record Inserted");
    });
})

router.get('/getDispatchDetails', (req, res) => {
    motherPlantDbQueries.getDispatchDetails((err, results) => {
        if (err) res.status(500).json(dbError(err));
        res.json((results));
    });
});

router.post('/addDispatchDetails', (req, res) => {
    let input = req.body;
    motherPlantDbQueries.addDispatchDetails(input, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
            input.DCNO = `DC-${results.insertId}`
            input.dispatchId = results.insertId
            motherPlantDbQueries.updateDispatchDetails(input, (updateErr, data) => {
                if (updateErr) console.log(updateErr)
                else res.json("Record Inserted");
            })
        }
    });
})

router.post('/updateDispatchDetails', (req, res) => {
    let input = req.body;
    motherPlantDbQueries.updateDispatchDetails(input, (updateErr, data) => {
        if (updateErr) console.log(updateErr)
    })
    res.json("Record Updated");
})

router.get('/getDepartmentsList', (req, res) => {
    motherPlantDbQueries.getDepartmentsList(req.query.departmentType, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        res.json((results));
    });
});

router.get('/getProductionDetails', (req, res) => {
    motherPlantDbQueries.getProductionDetails((err, results) => {
        if (err) res.status(500).json(dbError(err));
        res.json(results);
    })
});

router.get('/getProductionDetailsByDate/:date', (req, res) => {
    let { date } = req.params;
    motherPlantDbQueries.getCurrentProductionDetailsByDate(date, (err, productionResult) => {
        if (err) res.status(500).json(dbError(err));
        else if (productionResult.length) {
            motherPlantDbQueries.getCurrentDispatchDetailsByDate(date, (dispatchErr, dispatchResults) => {
                if (dispatchErr) res.status(500).json(dbError(err));
                else {
                    let product20LCount = 0, product1LCount = 0, product500MLCount = 0, product250MLCount = 0, count = 0

                    let productionObj = productionResult[0]
                    let { total20LCans = 0, total1LBoxes = 0, total500MLBoxes = 0, total250MLBoxes = 0 } = productionObj

                    let dispatchedObj = dispatchResults.length ? dispatchResults[0] : {}
                    let { total20LCans: dispatched20L = 0, total1LBoxes: dispatched1L = 0, total500MLBoxes: dispatched500ML = 0, total250MLBoxes: dispatched250ML = 0 } = dispatchedObj

                    product20LCount = total20LCans - dispatched20L
                    product1LCount = total1LBoxes - dispatched1L
                    product500MLCount = total500MLBoxes - dispatched500ML
                    product250MLCount = total250MLBoxes - dispatched250ML
                    res.json({ product20LCount, product1LCount, product500MLCount, product250MLCount });
                }
            })
        }
        else res.json({ product20LCount: 0, product1LCount: 0, product500MLCount: 0, product250MLCount: 0 });
    })
});

router.get('/getBatchNumbers', (req, res) => {
    motherPlantDbQueries.getBatchNumbers((err, results) => {
        if (err) res.status(500).json(dbError(err));
        res.json(results);
    })
});

router.get('/getNatureOfBussiness', (req, res) => {
    motherPlantDbQueries.getNatureOfBussiness((err, results) => {
        if (err) res.status(500).json(dbError(err));
        res.json(results);
    });
});

router.get('/getVehicleDetails', (req, res) => {
    motherPlantDbQueries.getVehicleDetails((err, results) => {
        if (err) res.status(500).json(dbError(err));
        res.json(results);
    });
});

router.post('/addVehicleDetails', (req, res) => {
    let input = req.body;
    motherPlantDbQueries.addVehicleDetails(input, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else
            res.json("Record Inserted");
    });
})

router.post('/addProductionDetails', (req, res) => {
    let input = req.body;
    motherPlantDbQueries.addProductionDetails(input, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
            input.batchId = getBatchId(input.shiftType)
            input.productionDate = new Date()
            input.productionid = results.insertId
            motherPlantDbQueries.updateProductionDetails(input, (updateErr, data) => {
                if (updateErr) res.status(500).json(dbError(updateErr));
                else res.json("Record Inserted");
            })
        }
    });
})

module.exports = router;