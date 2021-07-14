const auditQueries = require("../../dbQueries/auditlogs/queries");
const customerClosingQueries = require("../../dbQueries/Customer/closing");
const { decrypt } = require("../../utils/crypto");
const { dbError } = require("../../utils/functions");
const { compareCustomerClosingData } = require("../utils/customer");
let customerClosingControllers = {}

customerClosingControllers.getCustomerIdsByAgent = (req, res) => {
    customerClosingQueries.getCustomerIdsByAgent(req, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
            res.json(results)
        };
    });
}

customerClosingControllers.getCustomerDeliveryIds = (req, res) => {
    customerClosingQueries.getCustomerDeliveryIds(req.query, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
            res.json(results)
        };
    });
}

customerClosingControllers.getDepositDetailsByDeliveryId = (req, res) => {
    customerClosingQueries.getCustomerDepositDetailsByDeliveryId(req.query.deliveryId, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else if (results.length) {
            let result = results[0]
            customerClosingQueries.getCustomerPendingAmount(result.customerId, (err1, data) => {
                if (err) res.status(500).json(dbError(err));
                else if (!data.length) res.json(results)
                else {
                    result.pendingAmount = data[0].pendingAmount
                    result.balanceAmount = Math.abs(result.depositAmount - data[0].pendingAmount)
                    res.json([result])
                }
            })
        }
        else {
            res.json(results)
        };
    });
}

customerClosingControllers.getCustomerClosingDetails = (req, res) => {
    customerClosingQueries.getCustomerClosingDetails({ ...req.query, departmentId: req.departmentId, createdBy: req.userId, userRole: req.userRole }, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
            res.json(results)
        };
    });
}

customerClosingControllers.getCustomerClosingDetailsById = (req, res) => {
    customerClosingQueries.getCustomerClosingDetailsById(req.params.closingId, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else if (!results.length) res.json(results)
        else {
            let result = results[0]
            let accountDetails = JSON.parse(result.accountDetails)
            let { ifscCode, accountNumber, bankName, branchName } = accountDetails
            accountDetails.accountNumber = decrypt(accountNumber)
            accountDetails.ifscCode = decrypt(ifscCode)
            accountDetails.bankName = decrypt(bankName)
            accountDetails.branchName = decrypt(branchName)
            result.accountDetails = accountDetails
            res.json([result])
        };
    });
}

customerClosingControllers.addCustomerClosingDetails = (req, res) => {
    customerClosingQueries.addCustomerClosingDetails({ ...req.body, createdBy: req.userId }, (err, result) => {
        if (err) res.status(500).json(dbError(err));
        else {
            customerClosingQueries.addCustomerAccountDetails({ ...req.body.accountDetails, customerId: req.body.customerId, closingId: result.insertId }, (err1, data) => {
                if (err1) res.status(500).json(dbError(err1));
                else {
                    const { userId, userRole, userName } = req
                    auditQueries.createLog({ userId, description: `Customer Closing created by ${userRole} <b>(${userName})</b>`, customerId: req.body.customerId, type: "customerClosing" })
                    res.json('Details added successfully')
                }
            })
        };
    });
}

customerClosingControllers.updateCustomerClosingDetails = async (req, res) => {
    const { userId, userRole, userName } = req
    let logs = await compareCustomerClosingData(req.body, { userId, userRole, userName })
    customerClosingQueries.updateCustomerClosingDetails({ ...req.body, createdBy: req.userId }, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
            customerClosingQueries.updateCustomerAccountDetails(req.body.accountDetails, (err1, data) => {
                if (err1) res.status(500).json(dbError(err1));
                else {
                    if (logs.length) {
                        auditQueries.createLog(logs, (err, data) => {
                            if (err) console.log('log error', err)
                            else console.log('log data', data)
                        })
                    }
                    res.json('Details updated successfully')
                }
            })
        };
    });
}

customerClosingControllers.getCustomerClosingDetailsPaginationCount = (req, res) => {
    customerClosingQueries.getCustomerClosingDetailsPaginationCount({ createdBy: req.userId, userRole: req.userRole }, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
            res.json(results)
        };
    });
}


module.exports = customerClosingControllers