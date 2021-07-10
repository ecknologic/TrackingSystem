const customerClosingQueries = require("../../dbQueries/Customer/closing");
const { dbError } = require("../../utils/functions");
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
                    result.totalAmount = Math.abs(result.depositAmount - data[0].pendingAmount)
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
    customerClosingQueries.getCustomerClosingDetails({ ...req.query, createdBy: req.userId, userRole: req.userRole }, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
            res.json(results)
        };
    });
}

customerClosingControllers.addCustomerClosingDetails = (req, res) => {
    customerClosingQueries.addCustomerClosingDetails({ ...req.body, createdBy: req.userId }, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
            res.json(results)
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