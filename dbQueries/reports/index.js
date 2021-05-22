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

reportsQueries.getEnquiriesCountBySalesAgent = async (callback) => {
    let query = `SELECT COUNT(c.salesAgent) AS totalCustomersCount,u.userName FROM 
    customerenquirydetails c RIGHT JOIN usermaster u ON c.salesAgent=u.userId WHERE u.RoleId=5 GROUP BY c.salesAgent,u.userName`;
    return executeGetQuery(query, callback)
}

reportsQueries.getVisitedCustomersReport = async (callback) => {
    let query = `SELECT COUNT(*) AS visitedCustomers,  SUM(revisitDate IS NOT NULL AND EmailId NOT IN (SELECT EmailId FROM customerdetails )) AS revisitCustomers
    FROM customerenquirydetails`;
    return executeGetQuery(query, callback)
}

reportsQueries.getVisitedCustomersReportByStatus = async (callback) => {
    let query = ` SELECT COUNT(*) AS customersCount,cd.isApproved FROM customerenquirydetails c
    LEFT JOIN customerdetails cd ON c.EmailId=cd.EmailId
    WHERE c.EmailId  IN (SELECT EmailId FROM customerdetails ) GROUP BY cd.isApproved`;
    return executeGetQuery(query, callback)
}
module.exports = reportsQueries