var express = require('express');
var router = express.Router();
const { getProductionDetails, getVehicleDetails, getDispatchDetails, getAllQCDetails,
    createQC, getInternalQualityControl, createInternalQC, addProductionDetails, addVehicleDetails,
    getNatureOfBussiness, addDispatchDetails, getRMDetails, createRM, createRMReceipt, getRMReceiptDetails } = require('../dbQueries/motherplant/index.js');
const { dbError } = require('../utils/functions.js');

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
        else
            res.json("Record Inserted");
    });
})

router.get('/getProductionDetails', (req, res) => {
    getProductionDetails((err, results) => {
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
        else
            res.json("Record Inserted");
    });
})
module.exports = router;