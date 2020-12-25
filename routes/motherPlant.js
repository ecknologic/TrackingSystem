var express = require('express');
var router = express.Router();
const motherPlantDbQueries = require('../dbQueries/motherplant/queries');
const { dbError, getBatchId } = require('../utils/functions');
const { INSERTMESSAGE, UPDATEMESSAGE } = require('../utils/constants');
const dayjs = require('dayjs');
let departmentId;
//Middle ware that is specific to this router
router.use(function timeLog(req, res, next) {
    departmentId = req.headers['departmentid'] || 1
    next();
});



router.get('/getQualityControl', (req, res) => {
    motherPlantDbQueries.getAllQCDetails((err, results) => {
        if (err) res.status(500).json(dbError(err));
        else res.json(results);
    });
});

router.get('/getQCBatchIds', (req, res) => {
    motherPlantDbQueries.getProductionQcBatchIds(departmentId, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else res.json(results);
    });
});

router.get('/getQCDetailsByBatch/:batchId', (req, res) => {
    motherPlantDbQueries.getQCDetailsByBatch(req.params.batchId, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else res.json(results);
    });
});

router.get('/getProductionQcList', (req, res) => {
    motherPlantDbQueries.getProductionQcList(departmentId, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else res.json(results);
    });
});
router.get('/getQCTestedResults', (req, res) => {
    motherPlantDbQueries.getQCTestedResults(departmentId, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else res.json(results);
    });
});


router.post('/createQC', (req, res) => {
    let input = req.body;
    motherPlantDbQueries.createQC(input, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else
            res.json(INSERTMESSAGE);
    });
})

router.post('/createProductionQC', (req, res) => {
    let input = req.body;
    input.departmentId = departmentId
    motherPlantDbQueries.createProductionQC(input, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
            input.batchId = getBatchId(input.shiftType)
            input.productionQcId = results.insertId
            motherPlantDbQueries.updateProductionQC(input, (updateErr, data) => {
                if (updateErr) res.status(500).json(dbError(updateErr));
                else res.json(INSERTMESSAGE);
            })
        }
    });
})

router.post('/updateProductionQCStatus', (req, res) => {
    let input = req.body;
    motherPlantDbQueries.updateProductionQCStatus(input, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else
            res.json(UPDATEMESSAGE);
    });
})

router.post('/createQualityCheck', (req, res) => {
    let input = req.body;
    input.departmentId = departmentId
    motherPlantDbQueries.createQualityCheck(input, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else res.json(INSERTMESSAGE);
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
    let input = {
        status: req.query.status,
        departmentId
    }
    motherPlantDbQueries.getRMDetails(input, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        res.json(results);
    });
});

router.post('/createRM', (req, res) => {
    let input = req.body;
    input.departmentId = departmentId
    input.requestedDate = new Date()
    motherPlantDbQueries.createRM(input, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
            input.orderId = `OD-${results.insertId}`
            input.rawmaterialid = results.insertId
            motherPlantDbQueries.updateRMDetails(input, (updateErr, updatedData) => {
                if (updateErr) res.status(500).json(dbError(err));
                else res.json(INSERTMESSAGE)
            })
        }
    });
})

router.put('/updateRM', (req, res) => {
    let input = req.body;
    motherPlantDbQueries.updateRMDetails(input, (updateErr, updatedData) => {
        if (updateErr) res.status(500).json(dbError(err));
        else res.json(UPDATEMESSAGE)
    })
})

router.put('/updateRMStatus', (req, res) => {
    let input = req.body;
    motherPlantDbQueries.updateRMStatus(input, (updateErr, updatedData) => {
        if (updateErr) res.status(500).json(dbError(updateErr));
        else res.json(UPDATEMESSAGE)
    })
})

router.get('/getRMReceiptDetails', (req, res) => {
    motherPlantDbQueries.getRMReceiptDetails(departmentId, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else res.json(results);
    });
});

router.get('/getReceiptDetails/:RMId', (req, res) => {
    let input = {
        departmentId,
        rmId: req.params.RMId
    }
    motherPlantDbQueries.getReceiptDetailsByRMId(input, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else res.json(results);
    });
});

router.post('/createRMReceipt', (req, res) => {
    let input = req.body;
    input.departmentId = departmentId
    motherPlantDbQueries.createRMReceipt(input, (err, results) => {
        if (err) res.status(500).json(err.sqlMessage);
        else
            res.json(INSERTMESSAGE);
    });
})

router.get('/getDispatchDetails', (req, res) => {
    motherPlantDbQueries.getDispatchDetails(departmentId, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        res.json((results));
    });
});

router.post('/addDispatchDetails', (req, res) => {
    let input = req.body;
    input.departmentId = departmentId
    input.dispatchedDate = new Date()
    motherPlantDbQueries.addDispatchDetails(input, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
            input.DCNO = `DC-${results.insertId}`
            input.dispatchId = results.insertId
            motherPlantDbQueries.updateDispatchDetails(input, (updateErr, data) => {
                if (updateErr) console.log(updateErr)
                else res.json(INSERTMESSAGE);
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
    motherPlantDbQueries.getProductionDetails(departmentId, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else res.json(results);
    })
});

router.get('/getProductByBatch/:batchNo', (req, res) => {
    let { batchNo } = req.params
    let input = {
        departmentId, batchNo
    }
    motherPlantDbQueries.getProductsByBatch(input, (err, productionResult) => {
        if (err) res.status(500).json(dbError(err));
        else {
            motherPlantDbQueries.getDispatchesByBatch(input, (err, dispatchResults) => {
                if (err) res.status(500).json(dbError(err));
                else {
                    let { product20LCount = 0, product1LCount = 0, product500MLCount = 0, product250MLCount = 0 } = productionResult[0]
                    let { product20LCount: dispatched20L = 0, product1LCount: dispatched1L = 0, product500MLCount: dispatched500ML = 0, product250MLCount: dispatched250ML = 0 } = dispatchResults[0]

                    product20LCount = product20LCount - dispatched20L
                    product1LCount = product1LCount - dispatched1L
                    product500MLCount = product500MLCount - dispatched500ML
                    product250MLCount = product250MLCount - dispatched250ML
                    res.json({ product20LCount, product1LCount, product500MLCount, product250MLCount });
                }
            })
        }
    })
});

router.get('/getProductionDetailsByDate/:date', (req, res) => {
    let { date } = req.params;
    let input = {
        departmentId, date
    }
    motherPlantDbQueries.getCurrentProductionDetailsByDate(input, (err, productionResult) => {
        if (err) res.status(500).json(dbError(err));
        else if (productionResult.length) {
            motherPlantDbQueries.getPDDetailsByDate(input, (dispatchErr, dispatchResults) => {
                if (dispatchErr) res.status(500).json(dbError(err));
                else {
                    let product20LCount = 0, product1LCount = 0, product500MLCount = 0, product250MLCount = 0

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
    motherPlantDbQueries.getBatchNumbers(departmentId, (err, results) => {
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
            res.json(INSERTMESSAGE);
    });
})

router.post('/addProductionDetails', (req, res) => {
    let input = req.body;
    input.departmentId = departmentId
    motherPlantDbQueries.addProductionDetails(input, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
            input.productionid = results.insertId
            motherPlantDbQueries.updateProductionDetails(input, (updateErr, data) => {
                if (updateErr) res.status(500).json(dbError(updateErr));
                else res.json(INSERTMESSAGE);
            })
        }
    });
})
router.post('/updateProductionDetails', (req, res) => {
    let input = req.body;
    motherPlantDbQueries.updateProductionDetails(input, (updateErr, data) => {
        if (updateErr) res.status(500).json(dbError(updateErr));
        else res.json(data);
    })
})

module.exports = router;