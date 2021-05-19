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
    let query = `SELECT COUNT(*) AS totalCustomersCount,u.userName FROM customerenquirydetails c INNER JOIN usermaster u ON c.salesAgent=u.userId GROUP BY c.salesAgent`;
    return executeGetQuery(query, callback)
}
module.exports = reportsQueries