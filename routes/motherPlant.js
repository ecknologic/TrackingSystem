var express = require('express');
var router = express.Router();
const motherPlantDbQueries = require('../dbQueries/motherplant/queries');
const { dbError, getBatchId, productionCount, getCompareData, getFormatedNumber, getGraphData } = require('../utils/functions');
const { INSERTMESSAGE, UPDATEMESSAGE, WEEKDAYS, constants } = require('../utils/constants');
const dayjs = require('dayjs');
const usersQueries = require('../dbQueries/users/queries');
const auditQueries = require('../dbQueries/auditlogs/queries');
const { compareDepartmentData, compareCurrentStockLog } = require('./utils/department');
const departmenttransactionQueries = require('../dbQueries/departmenttransactions/queries');
let departmentId, adminUserId, userName, userRole;
//Middle ware that is specific to this router
router.use(function timeLog(req, res, next) {
    departmentId = req.headers['departmentid']
    adminUserId = req.headers['userid']
    userName = req.headers['username']
    userRole = req.headers['userrole']
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
router.get('/getProductionBatchIds/:shiftType', (req, res) => {
    const { shiftType } = req.params
    motherPlantDbQueries.getProductionBatchIds({ departmentId, shiftType }, (err, results) => {
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
                    auditQueries.createLog({ userId: adminUserId, description: `Motherplant Created by ${userRole} <b>(${userName})</b>`, departmentId: results.insertId, type: "motherplant" })
                    res.json(userResults);
                }
            })
        }
    });
});
router.post('/updateMotherPlant', async (req, res) => {
    const { departmentId, adminId: userId, removedAdminId, address, departmentName, city, state, pinCode, adminId, phoneNumber, gstNo } = req.body
    let data = {
        address, departmentName, city, state, pinCode, adminId, phoneNumber, gstNo
    }
    const logs = await compareDepartmentData(data, { departmentId, type: 'motherplant', adminUserId, userRole, userName })
    motherPlantDbQueries.updateMotherPlant(req.body, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
            usersQueries.updateUserDepartment({ departmentId, userId, removedAdminId }, (err, userResults) => {
                if (err) res.status(500).json(dbError(err));
                else {
                    if (logs.length) {
                        auditQueries.createLog(logs, (err, data) => {
                            if (err) console.log('log error', err)
                            else console.log('log data', data)
                        })
                    }
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
    motherPlantDbQueries.getQCTestResults(req.query, (err, results) => {
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
router.get('/getCurrentRMDetails', (req, res) => {
    const { isSuperAdmin = false } = req.query
    let input = {
        departmentId,
        isSuperAdmin
    }
    motherPlantDbQueries.getCurrentRMDetails(input, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else res.json(results);
    });
});

router.get('/getCurrentStockDetails', (req, res) => {
    const { isSuperAdmin = false } = req.query
    let input = {
        departmentId,
        isSuperAdmin
    }
    motherPlantDbQueries.getCurrentRMDetails(input, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
            const data = { emptyCansCount: 0 }
            results.map(item => {
                const { itemName, totalQuantity } = item;
                if (itemName === '20Lcans') data['20Lcans'] = totalQuantity;
                else if (itemName === '20LClosures') data['20LClosures'] = totalQuantity;
                else if (itemName === constants.Old20LCans) data['emptyCansCount'] = totalQuantity;
            })

            res.json(data)
        }
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
                else {
                    res.json(INSERTMESSAGE)
                    motherPlantDbQueries.getRMDetailsByItemCode(input.itemCode, (getErr, data) => {
                        if (getErr) console.log("ERR", getErr);
                        else if (!data.length) {
                            motherPlantDbQueries.insertRMDetails(input, (insertErr, data) => {
                                if (insertErr) console.log("ERR", insertErr);
                            })
                            if (input.itemName == '20Lcans') {
                                motherPlantDbQueries.insertRMDetails({ itemName: constants.Old20LCans, departmentId }, (insertErr, data) => {
                                    if (insertErr) console.log("ERR", insertErr);
                                })
                            }
                        }
                    })
                }
            })
        }
    });
})

router.post('/addOldEmptyCans', (req, res) => {
    motherPlantDbQueries.insertOldEmptyCans({ ...req.body, departmentId }, (insertErr, data) => {
        if (insertErr) res.status(500).json(dbError(insertErr));
        else res.json(data)
    })
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
        else {
            const data = results.map(item => {
                const newItem = { ...item }
                newItem.itemCount = getFormatedNumber(parseInt(newItem.itemCount))
                return newItem
            })
            res.json(data);
        }
    });
});

router.post('/createRMReceipt', (req, res) => {
    let input = req.body;
    input.departmentId = departmentId
    motherPlantDbQueries.getRMQtyByRMId(input, async (err, data) => {
        if (err) console.log('Err', err)
        else if (data.length) {
            const { itemQty, itemCode } = data[0]
            let logs = await compareCurrentStockLog({ totalQuantity: itemQty }, { departmentId, itemCode, userId: adminUserId, userRole, userName })
            motherPlantDbQueries.createRMReceipt(input, (err, results) => {
                if (err) res.status(500).json(err.sqlMessage);
                else {
                    res.json(INSERTMESSAGE);
                    if (logs.length) {
                        departmenttransactionQueries.createDepartmentTransaction(logs, (err, data) => {
                            if (err) console.log('log error', err)
                            else console.log('log data', data)
                        })
                    }
                    motherPlantDbQueries.updateRMDetailsStatus(input, (updateErr, success) => {
                        if (updateErr) console.log("ERR", updateErr);
                    })
                    motherPlantDbQueries.updateRMDetailsQuantity(input, (updateErr, success) => {
                        if (updateErr) console.log("ERR", updateErr);
                    })
                }
            });
        } else res.json('No data found with this material Id')
    })
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
        else res.json((results));
    });
});

router.put('/updateRMDamageCount', async (req, res) => {
    const { itemCode, damagedCount } = req.body; // Need itemcode from frontend
    let logs = await compareCurrentStockLog({ damagedCount }, { departmentId, itemCode, userId: adminUserId, userRole, userName })
    motherPlantDbQueries.updateRMDetailsDamageCount(req.body, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else res.json(UPDATEMESSAGE);
        if (logs.length) {
            departmenttransactionQueries.createDepartmentTransaction(logs, (err, data) => {
                if (err) console.log('log error', err)
                else console.log('log data', data)
            })
        }
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
                    let { product20LCount = 0, product1LCount = 0, product500MLCount = 0, product300MLCount = 0, product2LCount = 0 } = productionResult[0]
                    let { product20LCount: dispatched20L = 0, product1LCount: dispatched1L = 0, product500MLCount: dispatched500ML = 0, product300MLCount: dispatched300ML = 0, product2LCount: dispatched2L = 0 } = dispatchResults[0]

                    product20LCount = product20LCount - dispatched20L
                    product1LCount = product1LCount - dispatched1L
                    product500MLCount = product500MLCount - dispatched500ML
                    product300MLCount = product300MLCount - dispatched300ML
                    product2LCount = product2LCount - dispatched2L
                    res.json({ product20LCount, product1LCount, product500MLCount, product300MLCount, product2LCount });
                }
            })
        }
    })
});
router.get('/getTotalProduction', (req, res) => {
    let input = req.query
    const defaultValues = { product20LCount: 0, product1LCount: 0, product500MLCount: 0, product300MLCount: 0, product2LCount: 0 }
    motherPlantDbQueries.getTotalProduction(input, (err, productionResult) => {
        if (err) res.status(500).json(dbError(err));
        else if (productionResult.length) {
            const { product20LCount: p20L, product1LCount: p1L, product500MLCount: p500ml, product300MLCount: p300ml, product2LCount: p2l } = productionResult[0]
            const data = {
                product20LCount: getFormatedNumber(p20L),
                product1LCount: getFormatedNumber(p1L), product500MLCount: getFormatedNumber(p500ml),
                product300MLCount: getFormatedNumber(p300ml),
                product2LCount: getFormatedNumber(p2l)
            }
            if (input.type == "This Week") {
                let graph = [], product20LCount = 0, product2LCount = 0, product1LCount = 0, product500MLCount = 0, product300MLCount = 0;
                WEEKDAYS.map((day) => {
                    const index = productionResult.findIndex((item) => WEEKDAYS[dayjs(item.productionDate).day()] === day)
                    if (index >= 0) {
                        const { product20LCount: p20L, product1LCount: p1L, product500MLCount: p500ml, product300MLCount: p300ml, product2LCount: p2l } = productionResult[index]
                        graph = [...graph, ...getGraphData(p20L, p2l, p1L, p500ml, p300ml, day)]
                    }
                    else graph = [...graph, ...getGraphData(0, 0, 0, 0, 0, day)]
                })
                productionResult.map(product => {
                    const { product20LCount: p20L, product1LCount: p1L, product500MLCount: p500ml, product300MLCount: p300ml, product2LCount: p2l } = product
                    product20LCount += p20L
                    product1LCount += p1L
                    product500MLCount += p500ml
                    product300MLCount += p300ml
                    product2LCount += p2l
                })
                res.json({ product20LCount: getFormatedNumber(product20LCount), product2LCount: getFormatedNumber(product2LCount), product1LCount: getFormatedNumber(product1LCount), product500MLCount: getFormatedNumber(product500MLCount), product300MLCount: getFormatedNumber(product300MLCount), graph })
            } else {
                data.graph = getGraphData(p20L, p2l, p1L, p500ml, p300ml)
                res.json(data);
            }
        }
        else {
            if (input.type == "This Week") {
                let graph = []
                WEEKDAYS.map((day) => {
                    graph = [...graph, ...getGraphData(0, 0, 0, 0, 0, day)]
                })
                res.json({ ...defaultValues, graph })
            }
            else res.json({ ...defaultValues, graph: getGraphData(0, 0, 0, 0, 0) })
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
                    let product20LCount = 0, product1LCount = 0, product500MLCount = 0, product300MLCount = 0, product2LCount = 0

                    let productionObj = productionResult[0]
                    let { total20LCans = 0, total1LBoxes = 0, total500MLBoxes = 0, total300MLBoxes = 0, total2LBoxes = 0 } = productionObj

                    let dispatchedObj = dispatchResults.length ? dispatchResults[0] : {}
                    let { total20LCans: dispatched20L = 0, total1LBoxes: dispatched1L = 0, total500MLBoxes: dispatched500ML = 0, total300MLBoxes: dispatched300ML = 0, total2LBoxes: dispatched2L = 0 } = dispatchedObj

                    product20LCount = total20LCans - dispatched20L
                    product1LCount = total1LBoxes - dispatched1L
                    product500MLCount = total500MLBoxes - dispatched500ML
                    product300MLCount = total300MLBoxes - dispatched300ML
                    product2LCount = total2LBoxes - dispatched2L
                    res.json({ product20LCount, product1LCount, product500MLCount, product300MLCount, product2LCount });
                }
            })
        }
        else res.json({ product20LCount: 0, product1LCount: 0, product500MLCount: 0, product300MLCount: 0, product2LCount: 0 });
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
                    let product20LCount = 0, product1LCount = 0, product500MLCount = 0, product300MLCount = 0, product2LCount = 0

                    let productionObj = productionResult[0]
                    let { total20LCans = 0, total1LBoxes = 0, total500MLBoxes = 0, total300MLBoxes = 0, total2LBoxes = 0 } = productionObj

                    let dispatchedObj = dispatchResults.length ? dispatchResults[0] : {}
                    let { total20LCans: dispatched20L = 0, total1LBoxes: dispatched1L = 0, total500MLBoxes: dispatched500ML = 0, total300MLBoxes: dispatched300ML = 0, total2LBoxes: dispatched2L = 0 } = dispatchedObj

                    product20LCount = total20LCans - dispatched20L
                    product1LCount = total1LBoxes - dispatched1L
                    product500MLCount = total500MLBoxes - dispatched500ML
                    product300MLCount = total300MLBoxes - dispatched300ML
                    product2LCount = total2LBoxes - dispatched2L
                    res.json({ product20LCount, product1LCount, product500MLCount, product300MLCount, product2LCount });
                }
            })
        }
        else res.json({ product20LCount: 0, product1LCount: 0, product500MLCount: 0, product300MLCount: 0, product2LCount: 0 });
    })
});
router.get('/getTotalProductionByDate', (req, res) => {
    const { type } = req.query
    let input = {
        departmentId, ...req.query
    }
    const defaultValues = { product20LCount: 0, product1LCount: 0, product500MLCount: 0, product300MLCount: 0, product2LCount: 0 }
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
    const { type } = req.query
    motherPlantDbQueries.getTotalRevenue(req.query, (err, currentValues) => {
        if (err) res.status(500).json(dbError(err));
        else {
            motherPlantDbQueries.getTotalRevenueChange(req.query, (err, previousValues) => {
                if (err) res.status(500).json(dbError(err));
                else res.json(getCompareData(currentValues[0], previousValues[0], type, true));
            })
        }
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
            updateCurrentRMDetailsQuantity(input)
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

router.post('/createMPDamagedStock', (req, res) => {
    let input = { ...req.body, departmentId };
    motherPlantDbQueries.createDamagedStock(input, (err, data) => {
        if (err) res.status(500).json(dbError(err));
        else res.json(data);
    })
})

router.get('/getMPdamagedStock', (req, res) => {
    motherPlantDbQueries.getMPdamagedStock(departmentId, (err, data) => {
        if (err) res.status(500).json(dbError(err));
        else res.json(data);
    })
})

const getRetailQuantity = async ({ product1L, product500ML, product300ML, product2L }) => {
    return (product1L * 12) + (product500ML * 24) + (product300ML * 30) + (product2L * 9)
}

const updateCurrentRMDetailsQuantity = async (input) => {
    const { product20L = 0, emptyCansCount = 0, product1L = 0, product500ML = 0, product300ML = 0, product2L = 0, managerName } = input

    let retailQuantity = await getRetailQuantity({ product1L, product500ML, product300ML, product2L })

    motherPlantDbQueries.updateRetailQuantityRM(retailQuantity, (updateRetailErr, data) => {
        if (updateRetailErr) console.log(updateRetailErr);
    })
    motherPlantDbQueries.updateRMHandlesQuantity(product2L * 9, (update2lErr, data) => {
        if (update2lErr) console.log(update2lErr);
    })
    motherPlantDbQueries.update20LQuantityRM(parseInt(product20L) - parseInt(emptyCansCount), (update20LErr, data) => {
        if (update20LErr) console.log(update20LErr);
    })
    motherPlantDbQueries.update20LOldQuantityRM(emptyCansCount, (update20LErr, data) => {
        if (update20LErr) console.log(update20LErr);
    })
    let logs = [];
    motherPlantDbQueries.getCurrentRMDetails({ departmentId }, (err, data) => {
        if (err) console.log(err);
        else if (data.length) {
            for (let i of data) {
                const { totalQuantity, itemName, id } = i
                logs.push({
                    oldValue: totalQuantity,
                    updatedValue: getUpdatedValue({ totalQuantity, itemName, product2L: product2L * 9, product20L, retailQuantity }),
                    createdDateTime: new Date(),
                    userId: adminUserId,
                    description: `Stock utilized by manager <b>(${managerName})</b>`,
                    transactionId: id,
                    departmentId,
                    type: 'motherplant', subType: 'currentstock'
                })
                if (logs.length == data.length) {
                    departmenttransactionQueries.createDepartmentTransaction(logs, (err, data) => {
                        if (err) console.log('log error', err)
                        else console.log('log data', data)
                    })
                }
            }
        }
    })
}

const getUpdatedValue = ({ totalQuantity, itemName, product2L, product20L, retailQuantity }) => {
    if (itemName == 'retailClosures' || itemName == 'sleeves') return totalQuantity - retailQuantity;
    if (itemName == 'handles') return totalQuantity - product2L
    if (itemName == '20LClosures' || itemName == 'strikers' || itemName == '20Lcans') return totalQuantity - product20L
}

module.exports = router;

