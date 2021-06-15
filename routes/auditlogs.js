var express = require('express');
const auditQueries = require('../dbQueries/auditlogs/queries');
const departmenttransactionQueries = require('../dbQueries/departmenttransactions/queries');
var router = express.Router();
const { dbError } = require('../utils/functions');
let departmentId, userId;
//Middle ware that is specific to this router
router.use(function timeLog(req, res, next) {
    departmentId = req.headers['departmentid']
    userId = req.headers['userid']
    next();
});



router.get('/getAuditLogs', (req, res) => {
    auditQueries.getAudits(req.query, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else res.json(results);
    });
});

router.get('/getDepartmentLogs', (req, res) => {
    departmenttransactionQueries.getDepartmentTransactions(req.query, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else res.json(results);
    });
});

module.exports = router;

