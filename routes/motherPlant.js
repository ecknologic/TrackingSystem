var express = require('express');
var router = express.Router();
const motherPlantDbQueries = require('../dbQueries/motherplant/queries');
const { dbError, getBatchId, productionCount, getCompareData } = require('../utils/functions');
const { INSERTMESSAGE, UPDATEMESSAGE } = require('../utils/constants');
const dayjs = require('dayjs');
const usersQueries = require('../dbQueries/users/queries');
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
router.get('/getProductionBatchIds', (req, res) => {
    motherPlantDbQueries.getProductionBatchIds(departmentId, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else res.json(results);
    });
});
router.get('/getPostProductionBatchIds', (req, res) => {
    motherPlantDbQueries.getPostProductionBatchIds(departmentId, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else res.json(results);
    });
});

router.get('/getQCDetailsByBatch/:batchId', (req, res) => {
    const { batchId } = req.params;
    motherPlantDbQueries.getQCDetailsByBatch({ batchId, departmentId }, (err, results) => {
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
router.get('/getQCTestedBatches', (req, res) => {
    motherPlantDbQueries.getQCTestedBatches(departmentId, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else res.json(results);
    });
});

router.get('/getMotherPlantList', (req, res) => {
    motherPlantDbQueries.getMotherPlantsList((err, results) => {
        if (err) res.status(500).json(dbError(err));
        else res.json(results);
    });
});
router.get('/getMotherPlantById/:motherplantId', (req, res) => {
    motherPlantDbQueries.getMotherPlantById(req.params.motherplantId, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else res.json(results);
    });
});
router.post('/createMotherPlant', (req, res) => {
    motherPlantDbQueries.createMotherPlant(req.body, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
            usersQueries.updateUserDepartment({ departmentId: results.insertId, userId: req.body.adminId }, (err, userResults) => {
                if (err) res.status(500).json(dbError(err));
                else {
                    res.json(userResults);
                }
            })
        }
    });
});
router.post('/updateMotherPlant', (req, res) => {
    const { departmentId, adminId: userId, removedAdminId } = req.body
    motherPlantDbQueries.updateMotherPlant(req.body, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
            usersQueries.updateUserDepartment({ departmentId, userId, removedAdminId }, (err, userResults) => {
                if (err) res.status(500).json(dbError(err));
                else {
                    res.json(userResults);
                }
            })
        }
    });
});
router.get('/getProdQCTestedBatches', (req, res) => {
    motherPlantDbQueries.getProdQCTestedBatches(departmentId, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
            if (results.length) {
                let arr = []
                for (let i of results) {
                    let obj = i
                    obj.levels = JSON.parse(i.levels)
                    obj.batchId = i.batchId
                    arr.push(obj)
                }
                res.json(results);
            }
            else res.json(results);
        }
    });
});
router.get('/getQCTestResults', (req, res) => {
    let input = {
        departmentId, ...req.query
    }
    motherPlantDbQueries.getQCTestResults(input, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
            if (results.length) {
                let arr = []
                for (let i of results) {
                    let obj = i
                    obj.levels = JSON.parse(i.levels)
                    obj.batchId = i.batchId
                    arr.push(obj)
                }
                res.json(results);
            }
            else res.json(results);
        }
    });
});
router.get('/getQCLevelsDetails/:productionQcId', (req, res) => {
    const { productionQcId } = req.params
    motherPlantDbQueries.getQCLevelsDetails({ productionQcId, departmentId }, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else res.json(JSON.parse(results[0].QCDetails) || []);
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
    const { status, isSuperAdmin = false } = req.query
    let input = {
        status,
        departmentId,
        isSuperAdmin
    }
    motherPlantDbQueries.getRMDetails(input, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else res.json(results);
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
    const { isSuperAdmin = false } = req.query
    let input = {
        departmentId,
        isSuperAdmin
    }
    motherPlantDbQueries.getRMReceiptDetails(input, (err, results) => {
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
router.get('/getRMTotalCount', (req, res) => {
    motherPlantDbQueries.getRMTotalCount(departmentId, (err, results) => {
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

router.get('/getDispatchDetails/:date', (req, res) => {
    motherPlantDbQueries.getDispatchDetailsByDate({ departmentId, date: req.params.date }, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        res.json((results));
    });
});

router.post('/addDispatchDetails', (req, res) => {
    let input = req.body;
    input.departmentId = departmentId
    input.dispatchedDate = new Date()
    if (input.outOfStock == '1') {
        motherPlantDbQueries.updateProductionQCStockStatus(input.batchId, (err, data) => {
            if (err) console.log("Err", err)
        })
    }
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

router.get('/getAllDepartmentsList', (req, res) => {
    motherPlantDbQueries.getAllDepartmentsList(req.query.departmentType, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
            if (results.length) {
                results.push({ departmentId: null, departmentName: 'None' })
                res.json(results)
            }
            else res.json([])
        }
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
router.get('/getTotalProduction', (req, res) => {
    let input = req.query
    const defaultValues = { product20LCount: 0, product1LCount: 0, product500MLCount: 0, product250MLCount: 0 }
    motherPlantDbQueries.getTotalProduction(input, (err, productionResult) => {
        if (err) res.status(500).json(dbError(err));
        else if (productionResult.length)
            res.json(productionResult[0]);
        else
            res.json(defaultValues)
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
router.get('/getTotalProductionDetails', (req, res) => {
    let input = {
        departmentId, ...req.query
    }
    motherPlantDbQueries.getTotalProductionDetails(input, (err, productionResult) => {
        if (err) res.status(500).json(dbError(err));
        else if (productionResult.length) {
            const { batchIds } = productionResult[0]
            motherPlantDbQueries.getTotalPDDetails({ ...input, batchIds }, (dispatchErr, dispatchResults) => {
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
router.get('/getTotalProductionByDate', (req, res) => {
    const { type } = req.query
    let input = {
        departmentId, ...req.query
    }
    const defaultValues = { product20LCount: 0, product1LCount: 0, product500MLCount: 0, product250MLCount: 0 }
    motherPlantDbQueries.getTotalProductionByDate(input, (err, currentResult) => {
        if (err) res.status(500).json(dbError(err));
        else if (currentResult.length) {
            let currentValues = productionCount(currentResult);
            motherPlantDbQueries.getTotalProductionChangeByDate(input, (err, prevResult) => {
                if (err) res.status(500).json(dbError(err));
                else if (prevResult.length) {
                    let previousValues = productionCount(prevResult);
                    res.json({ ...currentValues, ...getCompareData(currentValues, previousValues, type) });
                }
                else res.json({ ...currentValues, ...getCompareData(currentValues, defaultValues, type) });
            })
        }
        else res.json({ ...defaultValues, ...getCompareData(defaultValues, defaultValues, type) });
    })
});

router.get('/getBatchNumbers', (req, res) => {
    motherPlantDbQueries.getProducedBatchNumbers(departmentId, (err, results) => {
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
router.get('/getTotalRevenue', (req, res) => {
    motherPlantDbQueries.getTotalRevenue(req.query, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        res.json(results);
    });
});


router.post('/createVehicle', (req, res) => {
    let input = req.body;
    motherPlantDbQueries.addVehicleDetails(input, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else
            res.json(INSERTMESSAGE);
    });
})
router.post('/updateVehicle', (req, res) => {
    let input = req.body;
    motherPlantDbQueries.updateVehicleDetails(input, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else
            res.json(UPDATEMESSAGE);
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
router.put('/updateEmptyCansStatus', (req, res) => {
    let input = req.body;
    motherPlantDbQueries.updateEmptyCansStatus(input, (updateErr, data) => {
        if (updateErr) res.status(500).json(dbError(updateErr));
        else res.json(data);
    })
})
router.delete('/deleteVehicle/:vehicleId', (req, res) => {
    motherPlantDbQueries.deleteVehicle(req.params.vehicleId, (err, results) => {
        if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
        else res.json(results);
    });
});

module.exports = router;

