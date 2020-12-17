const dayjs = require('dayjs');
var express = require('express');

var router = express.Router();
const { getProductionDetails, getVehicleDetails, getDispatchDetails, getAllQCDetails,
    createQC, getInternalQualityControl, createInternalQC, addProductionDetails, addVehicleDetails,
    getNatureOfBussiness, addDispatchDetails, getRMDetails, createRM, createRMReceipt, getRMReceiptDetails,
    updateProductionDetails, getBatchNumbers, updateDispatchDetails, getDepartmentsList, getCurrentProductionDetailsByDate } = require('../dbQueries/motherplant/index.js');
const { DATEFORMAT } = require('../utils/constants.js');
const { dbError, getBatchId } = require('../utils/functions.js');

//Middle ware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});



router.get('/getQualityControl', (req, res) => {
    getAllQCDetails((err, results) => {
        if (err) res.status(500).json(dbError(err));
        res.json(results);
    });
});

router.post('/createQC', (req, res) => {
    let input = req.body;
    createQC(input, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else
            res.json("Record Inserted");
    });
})
router.get('/getInternalQualityControl', (req, res) => {
    getInternalQualityControl((err, results) => {
        if (err) res.status(500).json(dbError(err));
        res.json(results);
    });
});
router.post('/createInternalQC', (req, res) => {
    let input = req.body;
    createInternalQC(input, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else
            res.json("Record Inserted");
    });
})

router.get('/getRMDetails', (req, res) => {
    getRMDetails((err, results) => {
        if (err) res.status(500).json(dbError(err));
        res.json(results);
    });
});

router.post('/createRM', (req, res) => {
    let input = req.body;
    createRM(input, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else
            res.json("Record Inserted");
    });
})
router.get('/getRMReceipt', (req, res) => {
    getRMReceiptDetails((err, results) => {
        if (err) res.status(500).json(dbError(err));
        res.json(results);
    });
});

router.post('/createRMReceipt', (req, res) => {
    let input = req.body;
    createRMReceipt(input, (err, results) => {
        if (err) res.status(500).json(err.sqlMessage);
        else
            res.json("Record Inserted");
    });
})

router.get('/getDispatchDetails', (req, res) => {
    getDispatchDetails((err, results) => {
        if (err) res.status(500).json(dbError(err));
        res.json((results));
    });
});

router.post('/addDispatchDetails', (req, res) => {
    let input = req.body;
    addDispatchDetails(input, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
            input.DCNO = `DC-${results.insertId}`
            input.dispatchId = results.insertId
            updateDispatchDetails(input, (updateErr, data) => {
                if (updateErr) console.log(updateErr)
            })
            res.json("Record Inserted");
        }
    });
})
router.post('/updateDispatchDetails', (req, res) => {
    let input = req.body;
    updateDispatchDetails(input, (updateErr, data) => {
        if (updateErr) console.log(updateErr)
    })
    res.json("Record Updated");
})
router.get('/getDepartmentsList', (req, res) => {
    getDepartmentsList(req.query.departmentType, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        res.json((results));
    });
});

router.get('/getProductionDetails', (req, res) => {
    getProductionDetails((err, results) => {
        if (err) res.status(500).json(dbError(err));
        res.json(results);
    })
});

router.get('/getProductionDetailsByDate/:date', (req, res) => {
    getCurrentProductionDetailsByDate((err, results) => {
        if (err) res.status(500).json(dbError(err));
        else if (results.length) {
            let product20LCount = 0, product1LCount = 0, product500MLCount = 0, product250MLCount = 0, count = 0
            for (let item of results) {
                count++
                if (dayjs(item.productionDate).format(DATEFORMAT) <= dayjs(req.params.date).format(DATEFORMAT)) {
                    if (dayjs(item.productionDate).format(DATEFORMAT) == dayjs(item.dispatchedDate).format(DATEFORMAT)) {
                        product20LCount = product20LCount + Math.abs(item.product20L - item.dispatched20L)
                        product1LCount = product1LCount + Math.abs(item.product1L - item.dispatched1L)
                        product500MLCount = product500MLCount + Math.abs(item.product500ML - item.dispatched500ML)
                        product250MLCount = product250MLCount + Math.abs(item.product250ML - item.dispatched250ML)
                    } else {
                        product20LCount = product20LCount++
                        product1LCount = product1LCount++
                        product500MLCount = product500MLCount++
                        product250MLCount = product250MLCount++
                    }
                }
                if (count == results.length)
                    res.json({ product20LCount, product1LCount, product500MLCount, product250MLCount });
            }
        }
    })
});
router.get('/getBatchNumbers', (req, res) => {
    getBatchNumbers((err, results) => {
        if (err) res.status(500).json(dbError(err));
        res.json(results);
    })
});

router.get('/getNatureOfBussiness', (req, res) => {
    getNatureOfBussiness((err, results) => {
        if (err) res.status(500).json(dbError(err));
        res.json(results);
    });
});

router.get('/getVehicleDetails', (req, res) => {
    getVehicleDetails((err, results) => {
        if (err) res.status(500).json(dbError(err));
        res.json(results);
    });
});

router.post('/addVehicleDetails', (req, res) => {
    let input = req.body;
    addVehicleDetails(input, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else
            res.json("Record Inserted");
    });
})

router.post('/addProductionDetails', (req, res) => {
    let input = req.body;
    addProductionDetails(input, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
            input.batchId = getBatchId(input.shiftType)
            input.productionDate = new Date()
            input.productionid = results.insertId
            updateProductionDetails(input, (updateErr, data) => {
            })
            res.json("Record Inserted");
        }
    });
})

module.exports = router;