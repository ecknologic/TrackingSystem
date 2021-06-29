const { executeGetQuery, executeGetParamsQuery, executePostOrUpdateQuery, dateComparisions, customerProductDetails } = require('../../utils/functions.js');
const receiptQueries = {}

receiptQueries.getReceiptId = async (callback) => {
    let query = `SELECT COALESCE(COUNT(*), 0) AS receiptId FROM customerreceipts`
    return executeGetQuery(query, callback)
}

receiptQueries.getCustomerReceipts = async (input, callback) => {
    const { offset=0 } = input
    let query = `SELECT * FROM customerreceipts ORDER BY createdDateTime DESC LIMIT 10 OFFSET ${offset}`
    return executeGetQuery(query, callback)
}

receiptQueries.getCustomerIdsForReceiptsDropdown = async (callback) => {
    let query = `SELECT customerNo as customerId FROM customerdetails`
    return executeGetQuery(query, callback)
}

receiptQueries.getCustomerDepositDetails = async (customerId, callback) => {
    let query = `SELECT IFNULL(c.organizationName,c.customerName) customerName,c.depositAmount,
    SUM(cp.noOfJarsToBePlaced) AS noOfCans FROM DeliveryDetails d INNER JOIN customerdetails c ON 
    c.customerId=d.customer_Id INNER JOIN customerproductdetails cp 
    ON d.deliveryDetailsId=cp.deliveryDetailsId WHERE cp.productName LIKE '20L' AND d.customer_Id=? GROUP BY d.customer_Id`
    return executeGetParamsQuery(query, [customerId], callback)
}

receiptQueries.createCustomerReceipt = async (input, callback) => {
    const { receiptNumber, customerId, depositAmount, noOfCans, paymentMode, transactionId } = input
    let query = "insert into customerreceipts (receiptNumber,customerId,depositAmount,noOfCans,paymentMode,transactionId,createdDateTime) values(?,?,?,?,?,?,?)";
    let requestBody = [receiptNumber, customerId, depositAmount, noOfCans, paymentMode, transactionId, new Date()]
    return executePostOrUpdateQuery(query, requestBody, callback)

}

module.exports = receiptQueries
