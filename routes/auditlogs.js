var express = require('express');
const auditQueries = require('../dbQueries/auditlogs/queries');
const departmenttransactionQueries = require('../dbQueries/departmenttransactions/queries');
const invoiceQueries = require('../dbQueries/invoice/queries');
const { decrypt } = require('../utils/crypto');
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
    auditQueries.getAudits(req.query, async (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else if (!results.length) res.send(results)
        else {
            if (req.query.type == 'customerClosing') {
                let arr = []
                for (let i of results) {
                    if (i.description.includes('account details') && !i.description.includes('customerName')) {
                        i.oldValue = await decrypt(i.oldValue)
                        i.updatedValue = await decrypt(i.updatedValue)
                        arr.push(i)
                    } else arr.push(i)
                    if (arr.length == results.length) res.json(arr)
                }
            }
            else res.json(results)
        };
    });
});

router.get('/getDepartmentLogs', (req, res) => {
    departmenttransactionQueries.getDepartmentTransactions(req.query, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else res.json(results);
    });
});

router.get('/getInvoiceLogs', (req, res) => {
    let { id, type } = req.query, queryMethod = 'getInvoicesLogsById';
    if (type == 'warehouse') queryMethod = 'getDepartmentInvoicesLogsById'
    invoiceQueries[queryMethod](id, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else if (results.length) {
            prepareResponseArray(results, res)
        }
        else res.json(results);
    });
});

const prepareResponseArray = (results, res) => {
    const { createdUserName, invoiceDate, creatorRole } = results[0]
    let logs = [];
    for (let i of results) {
        const { createdDateTime, RoleName, userName, amountPaid } = i
        let obj = {
            createdDateTime,
            description: `Rs.${amountPaid} received to ${RoleName} <b>(${userName})</b>`
        }
        logs.push(obj)
        if (logs.length == results.length) {
            logs.push({
                createdDateTime: invoiceDate,
                description: `Invoice created by ${creatorRole} <b>(${createdUserName})</b>`
            })
            res.json(logs)
        }
    }
}

module.exports = router;

