const { constants } = require('../../utils/constants.js');
const { executeGetQuery, executeGetParamsQuery, executePostOrUpdateQuery } = require('../../utils/functions.js');
const customerClosingQueries = {}

customerClosingQueries.getCustomerClosingDetails = async (input, callback) => {
    const { offset = 0, limit = 10, createdBy, userRole } = input
    let query = `SELECT * FROM customerclosingdetails WHERE createdBy=? ORDER BY createdDateTime DESC LIMIT ? OFFSET ?`
    if (userRole == constants.SUPERADMIN || userRole == constants.ACCOUNTSADMIN || userRole == constants.MARKETINGMANAGER) {
        query =`SELECT * FROM customerclosingdetails ORDER BY createdDateTime DESC LIMIT ${limit} OFFSET ${offset}`
        return executeGetQuery(query, callback)
    }
    return executeGetParamsQuery(query, [createdBy, limit, offset], callback)
}

customerClosingQueries.getCustomerClosingDetailsPaginationCount = async (input, callback) => {
    const { createdBy, userRole } = input
    let query = `SELECT count(*) as totalCount FROM customerclosingdetails WHERE createdBy=${createdBy}`
    if (userRole == constants.SUPERADMIN || userRole == constants.ACCOUNTSADMIN || userRole == constants.MARKETINGMANAGER) {
        query = `SELECT count(*) as totalCount FROM customerclosingdetails`
        return executeGetQuery(query, callback)
    }
    return executeGetQuery(query, callback)
}

customerClosingQueries.getCustomerIdsByAgent = async (input, callback) => {
    const { userId, userRole } = input
    let query = `SELECT customerNo,customerId,IFNULL(organizationName,customerName) as customerName FROM customerdetails WHERE createdBy=? OR salesAgent=? ORDER BY customerNo DESC`
    if (userRole == constants.SUPERADMIN || userRole == constants.ACCOUNTSADMIN || userRole == constants.MARKETINGMANAGER) {
        query = `SELECT customerNo,customerId,IFNULL(organizationName,customerName) as customerName FROM customerdetails WHERE createdBy IS NOT NULL ORDER BY customerNo DESC`
        return executeGetQuery(query, callback)
    }
    return executeGetParamsQuery(query, [userId, userId], callback)
}

customerClosingQueries.getCustomerDeliveryIds = async (input, callback) => {
    const { customerId } = input
    let query = `SELECT deliveryDetailsId,location FROM DeliveryDetails WHERE customer_Id=? ORDER BY customer_Id DESC`
    return executeGetParamsQuery(query, [customerId], callback)
}

customerClosingQueries.getCustomerDepositDetailsByDeliveryId = async (deliveryId, callback) => {
    let query = `SELECT c.customerId,c.depositAmount,
    SUM(CASE WHEN cp.productName LIKE '20L' THEN cp.noOfJarsToBePlaced ELSE 0 END) AS noOfCans FROM DeliveryDetails d INNER JOIN customerdetails c ON 
    c.customerId=d.customer_Id INNER JOIN customerproductdetails cp 
    ON d.deliveryDetailsId=cp.deliveryDetailsId WHERE d.deliveryDetailsId=?`
    return executeGetParamsQuery(query, [deliveryId], callback)
}

customerClosingQueries.getCustomerPendingAmount = async (customerId, callback) => {
    let query = `SELECT IFNULL(SUM(pendingAmount),0) AS pendingAmount  FROM Invoice WHERE customerId=?`
    return executeGetParamsQuery(query, [customerId], callback)
}

customerClosingQueries.addCustomerClosingDetails = async (input, callback) => {
    const { routeId, closingDate, customerId, customerName, noOfCans, collectedDate, collectedCans, pendingAmount, depositAmount, balanceAmount, missingCansAmount, totalAmount, reason, missingCansCount, createdBy } = input
    let query = "insert into customerclosingdetails (routeId, closingDate, customerId,customerName,noOfCans,collectedDate,collectedCans,pendingAmount,depositAmount,balanceAmount,missingCansAmount,totalAmount,reason,missingCansCount,createdBy,createdDateTime) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    let requestBody = [routeId, closingDate, customerId, customerName, noOfCans, collectedDate, collectedCans, pendingAmount, depositAmount, balanceAmount, missingCansAmount, totalAmount, reason, missingCansCount, createdBy, new Date()]
    return executePostOrUpdateQuery(query, requestBody, callback)

}

module.exports = customerClosingQueries
