const { executeGetQuery, executeGetParamsQuery, executePostOrUpdateQuery } = require('../../utils/functions.js');
let reportsQueries = {}

reportsQueries.getNewCustomerBTDetails = async (callback) => {
    let query = `SELECT c.customerNo,c.customerName,u.userName AS salesAgent,
    c.depositAmount,IFNULL(c.dispenserCount,0)AS dispenserCount ,SUM(cp.noOfJarsTobePlaced) quantity,
    CAST(cp.productPrice AS DECIMAL(10,2)) productPrice
    FROM customerdetails c INNER JOIN usermaster u ON c.salesAgent=u.userId INNER JOIN customerproductdetails cp ON c.customerId=cp.customerId WHERE cp.customerType='customer' AND cp.productName='20L' GROUP BY cp.customerId,cp.productPrice
     ORDER BY c.registeredDate DESC`;
    return executeGetQuery(query, callback)
}

reportsQueries.getEnquiriesCountBySalesAgent = async (input, callback) => {
    const { startDate, endDate, fromStart } = input
    let query = `SELECT COUNT(c.salesAgent) AS totalCustomersCount,u.userName FROM 
    customerenquirydetails c RIGHT JOIN usermaster u ON c.salesAgent=u.userId WHERE u.RoleId=5 AND DATE(registeredDate)<=? GROUP BY c.salesAgent,u.userName`;
    let options = [endDate]

    if (fromStart != 'true') {
        query = `SELECT COUNT(c.salesAgent) AS totalCustomersCount,u.userName FROM 
        customerenquirydetails c RIGHT JOIN usermaster u ON c.salesAgent=u.userId WHERE u.RoleId=5 AND DATE(c.registeredDate) BETWEEN ? AND ? GROUP BY c.salesAgent,u.userName`;
        options = [startDate, endDate]
    }
    return executeGetParamsQuery(query, options, callback)
}

reportsQueries.getVisitedCustomersReport = async (input, callback) => {
    const { startDate, endDate, fromStart } = input
    let query = `SELECT COUNT(*) AS visitedCustomers,  SUM(revisitDate IS NOT NULL AND EmailId NOT IN (SELECT EmailId FROM customerdetails )) AS revisitCustomers
    FROM customerenquirydetails WHERE DATE(registeredDate)<=?`;
    let options = [endDate]

    if (fromStart != 'true') {
        query = `SELECT COUNT(*) AS visitedCustomers,  IFNULL(SUM(revisitDate IS NOT NULL AND EmailId NOT IN (SELECT EmailId FROM customerdetails )),0) AS revisitCustomers
        FROM customerenquirydetails WHERE  DATE(registeredDate) BETWEEN ? AND ?`;
        options = [startDate, endDate]
    }
    return executeGetParamsQuery(query, options, callback)
}

reportsQueries.getVisitedCustomersReportByStatus = async (input, callback) => {
    const { startDate, endDate, fromStart } = input
    let query = ` SELECT COUNT(*) AS customersCount,cd.isApproved FROM customerenquirydetails c
    LEFT JOIN customerdetails cd ON c.EmailId=cd.EmailId
    WHERE c.EmailId  IN (SELECT EmailId FROM customerdetails ) GROUP BY cd.isApproved`;
    let options = [endDate]

    if (fromStart != 'true') {
        query = `SELECT COUNT(*) AS customersCount,cd.isApproved FROM customerenquirydetails c
        LEFT JOIN customerdetails cd ON c.EmailId=cd.EmailId
        WHERE c.EmailId  IN (SELECT EmailId FROM customerdetails ) AND  DATE(c.registeredDate) BETWEEN ? AND ? GROUP BY cd.isApproved`;
        options = [startDate, endDate]
    }
    return executeGetParamsQuery(query, options, callback)
}

reportsQueries.getDispensersViabilityReport = async (callback) => {
    let query = `SELECT IFNULL(c.customerName,c.organizationName)AS customerName,c.customerId,
    IFNULL(c.dispenserCount,0)AS dispenserCount,MAX(cp.productPrice) AS price, 
    SUM(co.20LCans*cp.productPrice+(cp.productPrice*12/100)) AS  invoiceAmount
     FROM customerdetails c INNER JOIN customerproductdetails cp ON c.customerId=cp.customerId INNER JOIN 
     customerorderdetails co ON c.customerNo=co.existingCustomerId
     WHERE cp.customerType='customer' AND cp.productName='20L' AND co.deliveredDate BETWEEN ${startDate} and ${endDate}  GROUP BY c.customerId ORDER BY c.customerId
     `;
    return executeGetQuery(query, callback)
}

reportsQueries.getClosedCustomerReport = async (callback) => {
    let query = `SELECT co.existingCustomerId,IFNULL(c.customerName,c.organizationName) AS customerName,
    SUM(co.20LCans-returnEmptyCans) AS  noOfBottlesWithCustomer,IFNULL(c.depositAmount,0) AS depositAmount
    FROM customerorderdetails co INNER JOIN customerdetails c ON c.customerId=co.existingCustomerId
    WHERE deliveredDate BETWEEN '2021-05-01' AND '2021-05-31' GROUP BY
    co.existingCustomerId`;
    return executeGetQuery(query, callback)
}

reportsQueries.getInActiveCustomerReport = async (callback) => {
    let query = `SELECT co.existingCustomerId,IFNULL(c.customerName,c.organizationName) AS customerName,
    SUM(co.20LCans) AS  lastmonthQuantity,  SUM(co.20LCans*co.price20L+(co.price20L*12/100)) AS  lastmonthAmount,
    MAX(co.deliveredDate) AS lastdeliveredDate
    FROM customerorderdetails co INNER JOIN customerdetails c ON c.customerId=co.existingCustomerId
    WHERE deliveredDate BETWEEN '2021-04-01' AND '2021-04-30' GROUP BY
    co.existingCustomerId`;
    return executeGetQuery(query, callback)
}
module.exports = reportsQueries