const { executeGetQuery, executeGetParamsQuery, executePostOrUpdateQuery } = require('../../utils/functions.js');
let reportsQueries = {}

reportsQueries.getNewCustomerBTDetails = async (input, callback) => {
    const { fromDate, toDate, fromStart } = input;
    let query = `SELECT c.customerNo,IFNULL(c.organizationName,c.customerName) as customerName,u.userName AS salesAgent,
    c.depositAmount,IFNULL(c.dispenserCount,0)AS dispenserCount ,SUM(cp.noOfJarsTobePlaced) quantity,
    CAST(cp.productPrice AS DECIMAL(10,2)) productPrice
    FROM customerdetails c INNER JOIN usermaster u ON c.salesAgent=u.userId INNER JOIN customerproductdetails cp ON c.customerId=cp.customerId WHERE cp.customerType='customer' AND cp.productName='20L' AND cp.noOfJarsTobePlaced>0 GROUP BY cp.customerId,cp.productPrice
     ORDER BY c.registeredDate DESC`;

    if (fromStart != 'true') {
        query = `SELECT c.customerNo,IFNULL(c.organizationName,c.customerName) as customerName,u.userName AS salesAgent,
         c.depositAmount,IFNULL(c.dispenserCount,0)AS dispenserCount ,SUM(cp.noOfJarsTobePlaced) quantity,
         CAST(cp.productPrice AS DECIMAL(10,2)) productPrice
         FROM customerdetails c INNER JOIN usermaster u ON c.salesAgent=u.userId INNER JOIN customerproductdetails cp ON c.customerId=cp.customerId WHERE cp.customerType='customer' AND cp.productName='20L' AND cp.noOfJarsTobePlaced>0 AND  DATE(c.registeredDate) BETWEEN ? AND ? GROUP BY cp.customerId,cp.productPrice
         ORDER BY c.registeredDate DESC`;
        let options = [fromDate, toDate]
        return executeGetParamsQuery(query, options, callback)
    }

    return executeGetQuery(query, callback)

}

reportsQueries.getEnquiriesCountBySalesAgent = async (input, callback) => {
    const { startDate, endDate, fromStart } = input
    let query = `SELECT COUNT(c.salesAgent) AS totalCustomersCount,u.userName FROM 
    customerenquirydetails c RIGHT JOIN usermaster u ON c.salesAgent=u.userId WHERE u.RoleId=5 GROUP BY c.salesAgent,u.userName`;
    let options = [endDate]

    if (fromStart != 'true') {
        query = `SELECT COUNT(c.salesAgent) AS totalCustomersCount,u.userName FROM 
        customerenquirydetails c RIGHT JOIN usermaster u ON c.salesAgent=u.userId AND DATE(c.registeredDate) BETWEEN ? AND ? WHERE u.RoleId=5  GROUP BY c.salesAgent,u.userName`;
        options = [startDate, endDate]
    }
    return executeGetParamsQuery(query, options, callback)
}

reportsQueries.getOpeningValuesBySalesAgent = async (input, callback) => {
    const { startDate, endDate, fromStart } = input
    let query = `SELECT COUNT(*) AS openingCount,CAST(SUM(i.pendingAmount) AS DECIMAL(10,2)) AS openingAmount,u.userName as executiveName,i.createdBy FROM Invoice i INNER JOIN usermaster u ON i.createdBy=u.userId WHERE DATE(i.invoiceDate) BETWEEN ? AND ?  GROUP BY i.createdBy`;
    let options = [startDate, endDate]

    // if (fromStart != 'true') {
    //     query = `SELECT COUNT(c.salesAgent) AS totalCustomersCount,u.userName FROM 
    //     customerenquirydetails c RIGHT JOIN usermaster u ON c.salesAgent=u.userId AND DATE(c.registeredDate) BETWEEN ? AND ? WHERE u.RoleId=5  GROUP BY c.salesAgent,u.userName`;
    //     options = [startDate, endDate]
    // }
    return executeGetParamsQuery(query, options, callback)
}

reportsQueries.getLastMonthInvoiceAmountBySalesAgent = async (input, callback) => {
    const { startDate, endDate, fromStart } = input
    let query = `SELECT COUNT(*) AS lastMonthCount,createdBy,COALESCE(CAST(SUM(totalAmount) AS DECIMAL(10,2)), 0) AS lastMonthAmount FROM Invoice WHERE DATE(invoiceDate) BETWEEN ? AND ? GROUP BY createdBy`;
    let options = [startDate, endDate]

    // if (fromStart != 'true') {
    //     query = `SELECT COUNT(c.salesAgent) AS totalCustomersCount,u.userName FROM 
    //     customerenquirydetails c RIGHT JOIN usermaster u ON c.salesAgent=u.userId AND DATE(c.registeredDate) BETWEEN ? AND ? WHERE u.RoleId=5  GROUP BY c.salesAgent,u.userName`;
    //     options = [startDate, endDate]
    // }
    return executeGetParamsQuery(query, options, callback)
}

reportsQueries.getReceivedAmountAsOnDate = async (input, callback) => {
    const { startDate, endDate, fromStart } = input
    let query = `SELECT SUM(amountPaid) AS receivedAmount,userId AS createdBy FROM invoicepaymentlogs WHERE paymentDate BETWEEN ? AND ? GROUP BY userId`;
    let options = [startDate, endDate]

    // if (fromStart != 'true') {
    //     query = `SELECT COUNT(c.salesAgent) AS totalCustomersCount,u.userName FROM 
    //     customerenquirydetails c RIGHT JOIN usermaster u ON c.salesAgent=u.userId AND DATE(c.registeredDate) BETWEEN ? AND ? WHERE u.RoleId=5  GROUP BY c.salesAgent,u.userName`;
    //     options = [startDate, endDate]
    // }
    return executeGetParamsQuery(query, options, callback)
}

reportsQueries.getReceivedCountAsOnDate = async (input, callback) => {
    const { startDate, endDate, fromStart } = input
    let query = `SELECT count(*) AS receivedCount,userId AS createdBy FROM invoicepaymentlogs l
    INNER JOIN Invoice i ON l.invoiceId=i.invoiceId WHERE i.pendingAmount=0 AND paymentDate BETWEEN ? AND ? GROUP BY l.userId`;
    let options = [startDate, endDate]

    // if (fromStart != 'true') {
    //     query = `SELECT COUNT(c.salesAgent) AS totalCustomersCount,u.userName FROM 
    //     customerenquirydetails c RIGHT JOIN usermaster u ON c.salesAgent=u.userId AND DATE(c.registeredDate) BETWEEN ? AND ? WHERE u.RoleId=5  GROUP BY c.salesAgent,u.userName`;
    //     options = [startDate, endDate]
    // }
    return executeGetParamsQuery(query, options, callback)
}

reportsQueries.getVisitedCustomersReport = async (input, callback) => {
    const { startDate, endDate, fromStart, staffId } = input
    let query = `SELECT COUNT(*) AS visitedCustomers,  SUM(revisitDate IS NOT NULL AND EmailId NOT IN (SELECT EmailId FROM customerdetails )) AS revisitCustomers
    FROM customerenquirydetails WHERE DATE(registeredDate)<=?`;
    let options = [endDate]

    if (fromStart != 'true') {
        query = `SELECT COUNT(*) AS visitedCustomers,  IFNULL(SUM(revisitDate IS NOT NULL AND EmailId NOT IN (SELECT EmailId FROM customerdetails )),0) AS revisitCustomers
        FROM customerenquirydetails WHERE  DATE(registeredDate) BETWEEN ? AND ?`;
        options = [startDate, endDate]
    }

    if (staffId && staffId != undefined) query = query + ` AND salesAgent=${staffId}`
    return executeGetParamsQuery(query, options, callback)
}

reportsQueries.getVisitedCustomersReportByStatus = async (input, callback) => {
    const { startDate, endDate, fromStart, staffId } = input
    let query = ` SELECT COUNT(*) AS customersCount,cd.isApproved FROM customerenquirydetails c
    LEFT JOIN customerdetails cd ON c.EmailId=cd.EmailId
    WHERE c.EmailId  IN (SELECT EmailId FROM customerdetails )`;
    let options = [endDate]

    if (fromStart != 'true') {
        query = `SELECT COUNT(*) AS customersCount,cd.isApproved FROM customerenquirydetails c
        LEFT JOIN customerdetails cd ON c.EmailId=cd.EmailId
        WHERE c.EmailId  IN (SELECT EmailId FROM customerdetails ) AND  DATE(c.registeredDate) BETWEEN ? AND ?`;
        options = [startDate, endDate]
    }

    if (staffId && staffId != undefined) query = query + ` AND c.salesAgent=${staffId} GROUP BY cd.isApproved`
    else query = query + ` GROUP BY cd.isApproved`

    return executeGetParamsQuery(query, options, callback)
}

reportsQueries.getDispensersViabilityReport = async (input, callback) => {
    const { fromDate: startDate, toDate: endDate, fromStart } = input
    let query = `SELECT IFNULL(c.organizationName,c.customerName)AS customerName,c.customerNo as customerId,
    IFNULL(c.dispenserCount,0)AS dispenserCount,MAX(cp.productPrice) AS price, 
    CAST(SUM(co.20LCans*cp.productPrice+(cp.productPrice*12/100)) AS DECIMAL(10,2)) AS  invoiceAmount
    FROM customerdetails c INNER JOIN customerproductdetails cp ON c.customerId=cp.customerId INNER JOIN 
    customerorderdetails co ON c.customerId=co.existingCustomerId
    WHERE cp.customerType='customer' AND cp.productName='20L' AND c.customerType='Corporate'  AND co.deliveredDate<=? GROUP BY c.customerId ORDER BY c.customerId
    `;
    let options = [endDate]

    if (fromStart != 'true') {
        query = `SELECT IFNULL(c.organizationName,c.customerName)AS customerName,c.customerNo as customerId,
        IFNULL(c.dispenserCount,0)AS dispenserCount,MAX(cp.productPrice) AS price, 
        CAST(SUM(co.20LCans*cp.productPrice+(cp.productPrice*12/100))AS DECIMAL(10,2)) AS  invoiceAmount
         FROM customerdetails c INNER JOIN customerproductdetails cp ON c.customerId=cp.customerId INNER JOIN 
         customerorderdetails co ON c.customerId=co.existingCustomerId
         WHERE cp.customerType='customer' AND cp.productName='20L' AND c.customerType='Corporate' AND co.deliveredDate BETWEEN ? AND ?  GROUP BY c.customerId ORDER BY c.customerId
         `;
        options = [startDate, endDate]
    }

    return executeGetParamsQuery(query, options, callback)
}

reportsQueries.getClosedCustomersReport = async (input, callback) => {
    const { fromDate: startDate, toDate: endDate, fromStart } = input
    let query = `SELECT c.customerNo as customerId,IFNULL(c.organizationName,c.customerName) AS customerName,
   IFNULL(SUM(co.20LCans-returnEmptyCans),0) AS  noOfBottlesWithCustomer,IFNULL(c.depositAmount,0) AS depositAmount,
   IFNULL(CAST(SUM(i.pendingAmount)AS DECIMAL(10,2)),0) AS pendingAmount
   FROM customerorderdetails co INNER JOIN customerdetails c ON c.customerId=co.existingCustomerId LEFT JOIN Invoice i ON 
   i.customerId=co.existingCustomerId WHERE c.isClosed=1 AND DATE(deliveredDate)<=?  GROUP BY co.existingCustomerId`;

    let options = [endDate]

    if (fromStart != 'true') {
        query = `SELECT c.customerNo as customerId,IFNULL(c.organizationName,c.customerName) AS customerName,
        IFNULL(SUM(co.20LCans-returnEmptyCans),0) AS  noOfBottlesWithCustomer,IFNULL(c.depositAmount,0) AS depositAmount,
        IFNULL(CAST(SUM(i.pendingAmount)AS DECIMAL(10,2)),0) AS pendingAmount
        FROM customerorderdetails co INNER JOIN customerdetails c ON c.customerId=co.existingCustomerId LEFT JOIN Invoice i ON 
        i.customerId=co.existingCustomerId WHERE c.isClosed=1 AND DATE(deliveredDate) BETWEEN ? AND ? GROUP BY co.existingCustomerId`;

        options = [startDate, endDate]
    }

    return executeGetParamsQuery(query, options, callback)
}

reportsQueries.getInActiveCustomersReport = async (input, callback) => {
    const { startDate, endDate } = input
    let query = `SELECT i.customerId,i.lastdeliveredDate,IFNULL(c.organizationName,c.customerName) as customerName,u.userName as executiveName
    FROM inactivecustomerdetails i INNER JOIN customerdetails c ON c.customerId=i.customerId
    INNER JOIN usermaster u ON u.userId=c.salesAgent
    WHERE DATE(i.createdDateTime) BETWEEN ? AND ?`;
    return executeGetParamsQuery(query, [startDate, endDate], callback)
}

reportsQueries.getInActiveCustomersInvoiceDetails = async (input, callback) => {
    const { startDate, endDate, customerIds } = input
    let query = `SELECT co.existingCustomerId as customerId,
    SUM(co.20LCans) AS  lastmonthQuantity, SUM(co.20LCans*co.price20L+(co.price20L*12/100)) AS  lastmonthAmount,
    MAX(co.deliveredDate) AS lastdeliveredDate
    FROM customerorderdetails co WHERE co.isDelivered='Completed' AND co.existingCustomerId IN (?) AND DATE(co.deliveredDate) BETWEEN ? AND ? GROUP BY co.existingCustomerId`;
    return executeGetParamsQuery(query, [customerIds, startDate, endDate], callback)
    // return executeGetParamsQuery(query, [customerIds, startDate, '2021-08-27'], callback) Testing
}

reportsQueries.getCustomerSalesDetails = async (input, callback) => {
    const { startDate, endDate } = input
    let query = `SELECT c.salesAgent,MIN(co.deliveryDate) AS startingDate,co.price20L AS price,SUM(co.20LCans) AS supplies,co.existingCustomerId
    FROM customerorderdetails co INNER JOIN customerdetails c ON co.existingCustomerId=c.customerId WHERE co.customerType='internal' AND DATE(deliveryDate) BETWEEN ? AND ? GROUP BY existingCustomerId`;
    return executeGetParamsQuery(query, [startDate, endDate], callback)
}

reportsQueries.getCustomerCountBySalesAgent = async (input, callback) => {
    const { startDate, endDate } = input
    let query = `SELECT COUNT(*) AS newUsersCount,u.userName AS executiveName,c.salesAgent,COUNT(CASE WHEN customertype = 'Corporate' THEN 1 ELSE NULL END) AS corporateCount,
    COUNT(CASE WHEN customertype = 'Individual' THEN 1 ELSE NULL END) AS individualCount
     FROM customerdetails c INNER JOIN usermaster u ON u.userId=c.salesAgent WHERE c.createdBy IS NOT NULL AND DATE(c.approvedDate) BETWEEN ? AND ? GROUP BY c.salesAgent`;
    return executeGetParamsQuery(query, [startDate, endDate], callback)
}

module.exports = reportsQueries