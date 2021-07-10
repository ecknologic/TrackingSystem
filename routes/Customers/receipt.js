const receiptQueries = require("../../dbQueries/Customer/receipt");
const { dbError } = require("../../utils/functions");

const getReceiptId = (req, res) => {
    receiptQueries.getReceiptId((err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
            res.send(getReceiptNumber(results[0].receiptId + 1))
        };
    });
}

const getCustomerIdsForReceiptsDropdown = (req, res) => {
    receiptQueries.getCustomerIdsForReceiptsDropdown((err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
            res.json(results)
        };
    });
}

const getCustomerDepositDetails = (req, res) => {
    receiptQueries.getCustomerDepositDetails(req.query.customerId, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
            res.json(results)
        };
    });
}

const createCustomerReceipt = (req, res) => {
    receiptQueries.createCustomerReceipt(req.body, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
            res.json(results)
        };
    });
}

const getCustomerReceipts = (req, res) => {
    receiptQueries.getCustomerReceipts(req.query, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
            res.json(results)
        };
    });
}

const getCustomerReceiptsPaginationCount = (req, res) => {
    receiptQueries.getCustomerReceiptsPaginationCount((err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
            res.json(results)
        };
    });
}


const getReceiptNumber = (number) => {
    if (number < 10) return `RD00${number}`
    else if (number < 100) return `RD0${number}`
    else return `RD${number}`
}

module.exports = { getReceiptId, getCustomerIdsForReceiptsDropdown, getCustomerDepositDetails, createCustomerReceipt, getCustomerReceipts, getCustomerReceiptsPaginationCount }