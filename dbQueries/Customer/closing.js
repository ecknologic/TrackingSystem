const { constants } = require('../../utils/constants.js');
const { encrypt } = require('../../utils/crypto.js');
const { executeGetQuery, executeGetParamsQuery, executePostOrUpdateQuery } = require('../../utils/functions.js');
const customerClosingQueries = {}

customerClosingQueries.getCustomerClosingDetails = async (input, callback) => {
    const { offset = 0, limit = 10, createdBy, userRole, departmentId } = input
    let query = `SELECT c.*,cust.customerNo,cust.natureOfBussiness,d.location as address,JSON_ARRAYAGG(d.contactPerson) as contactpersons FROM customerclosingdetails c INNER JOIN customerdetails cust ON c.customerId=cust.customerId INNER JOIN DeliveryDetails d ON c.deliveryDetailsId=d.deliveryDetailsId WHERE c.createdBy=? ORDER BY createdDateTime DESC LIMIT ? OFFSET ?`
    if (userRole == constants.SUPERADMIN || userRole == constants.ACCOUNTSADMIN || userRole == constants.MARKETINGMANAGER) {
        query = `SELECT c.*,cust.customerNo,cust.natureOfBussiness,d.location as address,JSON_ARRAYAGG(d.contactPerson) as contactpersons FROM customerclosingdetails c INNER JOIN customerdetails cust ON c.customerId=cust.customerId INNER JOIN DeliveryDetails d ON c.deliveryDetailsId=d.deliveryDetailsId ORDER BY createdDateTime DESC LIMIT ${limit} OFFSET ${offset}`
        return executeGetQuery(query, callback)
    }
    if (departmentId && departmentId != 'undefined'&& departmentId != 'null') {
        query = `SELECT c.*,cust.customerNo,cust.natureOfBussiness,d.location as address,JSON_ARRAYAGG(d.contactPerson) as contactpersons FROM customerclosingdetails c INNER JOIN customerdetails cust ON c.customerId=cust.customerId INNER JOIN DeliveryDetails d ON c.deliveryDetailsId=d.deliveryDetailsId WHERE c.departmentId=? ORDER BY createdDateTime DESC LIMIT ? OFFSET ?`
        return executeGetParamsQuery(query, [departmentId, limit, offset], callback)
    }
    return executeGetParamsQuery(query, [createdBy, limit, offset], callback)
}

customerClosingQueries.getCustomerClosingDetailsById = async (id, callback) => {
    let query = `SELECT c.*,cust.customerNo,dep.departmentName,d.location,r.RouteName,JSON_OBJECT('accountId',a.accountId,'closingId',a.closingId,'accountNumber',a.accountNumber,'customerName',a.customerName,
    'ifscCode',a.ifscCode,'bankName',a.bankName,'branchName',a.branchName) AS accountDetails FROM customerclosingdetails c
    INNER JOIN  customeraccountdetails a ON c.closingId=a.closingId INNER JOIN  DeliveryDetails d ON c.customerId=d.customer_Id
    INNER JOIN  departmentmaster dep ON d.departmentId=dep.departmentId
    INNER JOIN  routes r ON d.routeId=r.RouteId
    INNER JOIN customerdetails cust ON c.customerId=cust.customerId  WHERE c.closingId=${id}`
    return executeGetQuery(query, callback)
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
    let query = `SELECT c.customerId,c.depositAmount,d.departmentId,d.routeId,
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
    const { routeId, closingDate, customerId, customerName, noOfCans, collectedDate, collectedCans, pendingAmount, depositAmount, balanceAmount, missingCansAmount, totalAmount, reason, missingCansCount, createdBy, departmentId, deliveryDetailsId } = input
    let query = "insert into customerclosingdetails (routeId, closingDate, customerId,customerName,noOfCans,collectedDate,collectedCans,pendingAmount,depositAmount,balanceAmount,missingCansAmount,totalAmount,reason,missingCansCount,createdBy,departmentId,deliveryDetailsId,createdDateTime) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    let requestBody = [routeId, closingDate, customerId, customerName, noOfCans, collectedDate, collectedCans, pendingAmount, depositAmount, balanceAmount, missingCansAmount, totalAmount, reason, missingCansCount, createdBy, departmentId, deliveryDetailsId, new Date()]
    return executePostOrUpdateQuery(query, requestBody, callback)

}

customerClosingQueries.updateCustomerClosingDetails = async (input, callback) => {
    const { routeId, closingDate, customerId, customerName, noOfCans, collectedDate, collectedCans, pendingAmount, depositAmount, balanceAmount, missingCansAmount, totalAmount, reason, missingCansCount, createdBy, departmentId, closingId, deliveryDetailsId } = input
    let query = "UPDATE customerclosingdetails SET routeId=?, closingDate=?, customerId=?,customerName=?,noOfCans=?,collectedDate=?,collectedCans=?,pendingAmount=?,depositAmount=?,balanceAmount=?,missingCansAmount=?,totalAmount=?,reason=?,missingCansCount=?,createdBy=?,deliveryDetailsId=?,departmentId=? WHERE closingId=?";
    let requestBody = [routeId, closingDate, customerId, customerName, noOfCans, collectedDate, collectedCans, pendingAmount, depositAmount, balanceAmount, missingCansAmount, totalAmount, reason, missingCansCount, createdBy, departmentId, deliveryDetailsId, closingId]
    return executePostOrUpdateQuery(query, requestBody, callback)

}

customerClosingQueries.addCustomerAccountDetails = async (input, callback) => {
    let { customerName, accountNumber, ifscCode, bankName, branchName, customerId, closingId } = input
    let query = "insert into customeraccountdetails (customerName, accountNumber, ifscCode, bankName, branchName, customerId, closingId,createdDateTime) values(?,?,?,?,?,?,?,?)";
    accountNumber = encrypt(accountNumber)
    ifscCode = encrypt(ifscCode)
    bankName = encrypt(bankName)
    branchName = encrypt(branchName)
    let requestBody = [customerName, accountNumber, ifscCode, bankName, branchName, customerId, closingId, new Date()]
    return executePostOrUpdateQuery(query, requestBody, callback)
}

customerClosingQueries.updateCustomerAccountDetails = async (input, callback) => {
    let { customerName, accountNumber, ifscCode, bankName, branchName, customerId, closingId, accountId } = input
    let query = "UPDATE customeraccountdetails SET customerName=?, accountNumber=?, ifscCode=?, bankName=?, branchName=?, customerId=?, closingId=? WHERE accountId=?";
    accountNumber = encrypt(accountNumber)
    ifscCode = encrypt(ifscCode)
    bankName = encrypt(bankName)
    branchName = encrypt(branchName)
    let requestBody = [customerName, accountNumber, ifscCode, bankName, branchName, customerId, closingId, accountId]
    return executePostOrUpdateQuery(query, requestBody, callback)

}

module.exports = customerClosingQueries
