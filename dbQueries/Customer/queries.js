var dayjs = require('dayjs')
const { FULLTIMEFORMAT } = require('../../utils/constants.js');
const { executeGetQuery, executeGetParamsQuery, executePostOrUpdateQuery, dateComparisions } = require('../../utils/functions.js');
const { getDeliverysByCustomerOrderId } = require('../warehouse/queries.js');
let customerQueries = {}

customerQueries.getCustomerDetails = (customerId, callback) => {
    let query = "SELECT isSuperAdminApproved,rocNo,poNo,depositAmount,customerId,customerName,c.mobileNumber,c.EmailId,c.Address1,c.gstNo,c.panNo,c.adharNo,c.registeredDate,c.invoicetype,c.natureOfBussiness,c.creditPeriodInDays,referredBy,isApproved,customertype,organizationName,idProofType,pincode as pinCode, dispenserCount, contractPeriod,customer_id_proof,d.idProof_backside,d.idProof_frontside,d.gstProof,u.userName as createdUserName from customerdetails c LEFT JOIN customerDocStore d ON c.customer_id_proof=d.docId INNER JOIN usermaster u ON u.userId=c.createdBy WHERE c.customerId=" + customerId
    executeGetQuery(query, callback)
}
customerQueries.getCustomerDetailsForDC = (customerId, callback) => {
    let query = "SELECT mobileNumber as phoneNumber,Address1 as address,EmailId,customerName from customerdetails WHERE customerId=" + customerId
    executeGetQuery(query, callback)
}
customerQueries.getOrdersByDepartmentId = (departmentId, callback) => {
    let query = "SELECT d.registeredDate,d.address,d.contactPerson,d.deliveryDetailsId,d.isActive as isApproved,d.vehicleId,r.routeName,r.routeId,dri.driverName,dri.driverId,dri.mobileNumber FROM DeliveryDetails d INNER JOIN routes r ON d.routeId=r.routeId left JOIN driverdetails dri ON d.driverId=dri.driverid WHERE d.deleted=0 AND d.isActive=1 AND d.departmentId=? ORDER BY d.registeredDate DESC";
    executeGetParamsQuery(query, [departmentId], callback)
}
customerQueries.getRoutesByDepartmentId = (departmentId, callback) => {
    let query = `SELECT r.RouteId,r.RouteName,r.RouteDescription,d.departmentName from routes r INNER JOIN departmentmaster d ON d.departmentId=r.departmentId WHERE r.departmentId=${departmentId} AND r.deleted='0' ORDER BY r.createdDateTime DESC`
    executeGetQuery(query, callback)
}
customerQueries.getCustomersByCustomerType = (customerType, callback) => {
    let query = "SELECT c.organizationName,c.isActive,c.customertype,c.isApproved,c.customerId,c.natureOfBussiness,c.customerName,c.registeredDate,c.approvedDate,c.address1 AS address,JSON_ARRAYAGG(d.contactperson) AS contactpersons FROM customerdetails c INNER JOIN DeliveryDetails d ON c.customerId=d.customer_Id WHERE c.customertype=? and c.isApproved=1 and d.deleted=0  GROUP BY c.organizationName,c.customerName,c.natureOfBussiness,c.address1,c.isActive,c.isApproved,c.customerId,c.registeredDate,c.approvedDate ORDER BY c.lastApprovedDate DESC"
    executeGetParamsQuery(query, [customerType], callback)
}
customerQueries.getInActiveCustomers = (callback) => {
    let query = "SELECT c.organizationName,c.customertype,c.isActive,c.customerId,c.natureOfBussiness,c.customerName,c.registeredDate,c.address1 AS address,JSON_ARRAYAGG(d.contactperson) AS contactpersons FROM customerdetails c INNER JOIN DeliveryDetails d ON c.customerId=d.customer_Id WHERE c.isApproved=0 AND c.approvedDate IS NOT NULL and d.deleted=0  GROUP BY c.organizationName,c.customerName,c.natureOfBussiness,c.address1,c.isActive,c.customerId,c.registeredDate ORDER BY c.lastDraftedDate DESC"
    executeGetParamsQuery(query, callback)
}
customerQueries.getCustomerBillingAddress = (customerId, callback) => {
    let query = "SELECT organizationName as customerName,creditPeriodInDays,EmailId,gstNo,panNo,customerId,customerName,mobileNumber,address1 AS address FROM customerdetails c WHERE customerId=" + customerId
    executeGetParamsQuery(query, [customerId], callback)
}
customerQueries.getCustomerNames = (callback) => {
    let query = "SELECT organizationName as customerName,customerId FROM customerdetails c WHERE isApproved=1 and deleted=0 ORDER BY lastDraftedDate DESC"
    executeGetParamsQuery(query, callback)
}
customerQueries.getTotalCustomers = (input, callback) => {
    let { startDate, endDate, fromStart } = input;
    let query = "SELECT COUNT(*) as totalCount FROM customerdetails WHERE deleted=0"
    if (fromStart !== 'true') {
        query = "SELECT COUNT(*) as totalCount FROM customerdetails WHERE deleted=0 AND  DATE(registeredDate)>=? AND DATE(registeredDate)<=?"
        executeGetParamsQuery(query, [startDate, endDate], callback)
    } else executeGetParamsQuery(query, callback)
}
customerQueries.getTotalActiveCustomers = (input, callback) => {
    let { startDate, endDate, fromStart } = input;
    let query = "SELECT COUNT(*) as totalCount FROM customerdetails WHERE isApproved=1 AND deleted=0"
    if (fromStart !== 'true') {
        query = "SELECT COUNT(*) as totalCount FROM customerdetails WHERE isApproved=1 AND deleted=0 AND  DATE(registeredDate)>=? AND DATE(registeredDate)<=?"
        executeGetParamsQuery(query, [startDate, endDate], callback)
    } else executeGetParamsQuery(query, callback)
}
customerQueries.getTotalActiveCustomersChange = (input, callback) => {
    let { startDate, endDate, fromStart, type } = input;
    const { startDate: newStartDate, endDate: newEndDate } = dateComparisions(startDate, endDate, type)
    let query = "SELECT COUNT(*) as totalCount FROM customerdetails WHERE isApproved=1 AND deleted=0"
    if (fromStart !== 'true') {
        query = "SELECT COUNT(*) as totalCount FROM customerdetails WHERE isApproved=1 AND deleted=0 AND  DATE(registeredDate)>=? AND DATE(registeredDate)<=?"
        executeGetParamsQuery(query, [newStartDate, newEndDate], callback)
    } else executeGetParamsQuery(query, callback)
}
customerQueries.getTotalActiveCorporateCustomers = (input, callback) => {
    let { startDate, endDate, fromStart } = input;
    let query = "SELECT COUNT(*) as totalCount FROM customerdetails WHERE isApproved=1 AND deleted=0 AND customertype='Corporate'"
    if (fromStart !== 'true') {
        query = "SELECT COUNT(*) as totalCount FROM customerdetails WHERE isApproved=1 AND deleted=0 AND customertype='Corporate' AND  DATE(registeredDate)>=? AND DATE(registeredDate)<=?"
        executeGetParamsQuery(query, [startDate, endDate], callback)
    } else executeGetParamsQuery(query, callback)
}
customerQueries.getTotalActiveCorporateCustomersChange = (input, callback) => {
    let { startDate, endDate, fromStart, type } = input;
    const { startDate: newStartDate, endDate: newEndDate } = dateComparisions(startDate, endDate, type)
    let query = "SELECT COUNT(*) as totalCount FROM customerdetails WHERE isApproved=1 AND deleted=0 AND customertype='Corporate'"
    if (fromStart !== 'true') {
        query = "SELECT COUNT(*) as totalCount FROM customerdetails WHERE isApproved=1 AND deleted=0 AND customertype='Corporate' AND  DATE(registeredDate)>=? AND DATE(registeredDate)<=?"
        executeGetParamsQuery(query, [newStartDate, newEndDate], callback)
    } else executeGetParamsQuery(query, callback)
}
customerQueries.getTotalActiveCustomers = (input, callback) => {
    let { startDate, endDate, fromStart } = input;
    let query = "SELECT COUNT(*) as totalCount FROM customerdetails WHERE isApproved=1 AND deleted=0"
    if (fromStart !== 'true') {
        query = "SELECT COUNT(*) as totalCount FROM customerdetails WHERE isApproved=1 AND deleted=0 AND  DATE(registeredDate)>=? AND DATE(registeredDate)<=?"
        executeGetParamsQuery(query, [startDate, endDate], callback)
    }
    else executeGetParamsQuery(query, callback)
}
customerQueries.getTotalInActiveCustomers = (input, callback) => {
    let { startDate, endDate, fromStart } = input;
    let query = "SELECT COUNT(*) as totalCount FROM customerdetails WHERE isApproved=0 AND deleted=0 AND approvedDate IS NOT NULL"
    if (fromStart !== 'true') {
        query = "SELECT COUNT(*) as totalCount FROM customerdetails WHERE isApproved=0 AND deleted=0 AND approvedDate IS NOT NULL AND DATE(registeredDate)>=? AND DATE(registeredDate)<=?"
        executeGetParamsQuery(query, [startDate, endDate], callback)
    }
    else executeGetParamsQuery(query, callback)
}
customerQueries.getTotalInActiveCustomersChange = (input, callback) => {
    let { startDate, endDate, fromStart, type } = input;
    const { startDate: newStartDate, endDate: newEndDate } = dateComparisions(startDate, endDate, type)
    let query = "SELECT COUNT(*) as totalCount FROM customerdetails WHERE isApproved=0 AND deleted=0 AND approvedDate IS NOT NULL"
    if (fromStart !== 'true') {
        query = "SELECT COUNT(*) as totalCount FROM customerdetails WHERE isApproved=0 AND deleted=0 AND approvedDate IS NOT NULL AND DATE(registeredDate)>=? AND DATE(registeredDate)<=?"
        executeGetParamsQuery(query, [newStartDate, newEndDate], callback)
    }
    else executeGetParamsQuery(query, callback)
}
customerQueries.getTotalPendingCorporateCustomers = (input, callback) => {
    let { startDate, endDate, fromStart } = input;
    let query = "SELECT COUNT(*) as totalCount FROM customerdetails WHERE isApproved=0 AND approvedDate IS NULL AND deleted=0 AND customertype='Corporate'"
    if (fromStart !== 'true') {
        query = "SELECT COUNT(*) as totalCount FROM customerdetails WHERE isApproved=0 AND approvedDate IS NULL AND deleted=0 AND customertype='Corporate' AND DATE(registeredDate)>=? AND DATE(registeredDate)<=?"
        executeGetParamsQuery(query, [startDate, endDate], callback)
    }
    else executeGetParamsQuery(query, callback)
}
customerQueries.getTotalPendingCorporateCustomersChange = (input, callback) => {
    let { startDate, endDate, fromStart, type } = input;
    const { startDate: newStartDate, endDate: newEndDate } = dateComparisions(startDate, endDate, type)
    let query = "SELECT COUNT(*) as totalCount FROM customerdetails WHERE isApproved=0 AND approvedDate IS NULL AND deleted=0 AND customertype='Corporate'"
    if (fromStart !== 'true') {
        query = "SELECT COUNT(*) as totalCount FROM customerdetails WHERE isApproved=0 AND approvedDate IS NULL AND deleted=0 AND customertype='Corporate' AND DATE(registeredDate)>=? AND DATE(registeredDate)<=?"
        executeGetParamsQuery(query, [newStartDate, newEndDate], callback)
    }
    else executeGetParamsQuery(query, callback)
}
customerQueries.getTotalActiveOtherCustomers = (input, callback) => {
    let { startDate, endDate, fromStart } = input;
    let query = "SELECT COUNT(*) as totalCount FROM customerdetails WHERE isApproved=1 AND deleted=0 AND customertype='Individual'"
    if (fromStart !== 'true') {
        query = "SELECT COUNT(*) as totalCount FROM customerdetails WHERE isApproved=1 AND deleted=0 AND customertype='Individual' AND DATE(registeredDate)>=? AND DATE(registeredDate)<=?"
        executeGetParamsQuery(query, [startDate, endDate], callback)
    }
    else executeGetParamsQuery(query, callback)
}
customerQueries.getTotalActiveOtherCustomersChange = (input, callback) => {
    let { startDate, endDate, fromStart, type } = input;
    const { startDate: newStartDate, endDate: newEndDate } = dateComparisions(startDate, endDate, type)
    let query = "SELECT COUNT(*) as totalCount FROM customerdetails WHERE isApproved=1 AND deleted=0 AND customertype='Individual'"
    if (fromStart !== 'true') {
        query = "SELECT COUNT(*) as totalCount FROM customerdetails WHERE isApproved=1 AND deleted=0 AND customertype='Individual' AND DATE(registeredDate)>=? AND DATE(registeredDate)<=?"
        executeGetParamsQuery(query, [newStartDate, newEndDate], callback)
    }
    else executeGetParamsQuery(query, callback)
}
customerQueries.getTotalPendingOtherCustomers = (input, callback) => {
    let { startDate, endDate, fromStart } = input;
    let query = "SELECT COUNT(*) as totalCount FROM customerdetails WHERE isApproved=0 AND approvedDate IS NULL AND deleted=0 AND customertype='Individual'"
    if (fromStart !== 'true') {
        query = "SELECT COUNT(*) as totalCount FROM customerdetails WHERE isApproved=0 AND approvedDate IS NULL AND deleted=0 AND customertype='Individual' AND DATE(registeredDate)>=? AND DATE(registeredDate)<=?"
        executeGetParamsQuery(query, [startDate, endDate], callback)
    }
    else executeGetParamsQuery(query, callback)
}
customerQueries.getTotalPendingOtherCustomersChange = (input, callback) => {
    let { startDate, endDate, fromStart, type } = input;
    const { startDate: newStartDate, endDate: newEndDate } = dateComparisions(startDate, endDate, type)
    let query = "SELECT COUNT(*) as totalCount FROM customerdetails WHERE isApproved=0 AND approvedDate IS NULL AND deleted=0 AND customertype='Individual'"
    if (fromStart !== 'true') {
        query = "SELECT COUNT(*) as totalCount FROM customerdetails WHERE isApproved=0 AND approvedDate IS NULL AND deleted=0 AND customertype='Individual' AND DATE(registeredDate)>=? AND DATE(registeredDate)<=?"
        executeGetParamsQuery(query, [newStartDate, newEndDate], callback)
    }
    else executeGetParamsQuery(query, callback)
}
customerQueries.getTotalDistributorsCount = (input, callback) => {
    let { startDate, endDate, fromStart } = input;
    let query = " SELECT COUNT(*) as totalCount FROM Distributors WHERE isActive=1 AND deleted=0";
    if (fromStart !== 'true') {
        query = " SELECT COUNT(*) as totalCount FROM Distributors WHERE isActive=1 AND deleted=0 AND DATE(createdDateTime)>=? AND DATE(createdDateTime)<=?";
        executeGetParamsQuery(query, [startDate, endDate], callback)
    }
    else executeGetParamsQuery(query, callback)
}
customerQueries.getTotalDistributorsCountChange = (input, callback) => {
    let { startDate, endDate, fromStart, type } = input;
    const { startDate: newStartDate, endDate: newEndDate } = dateComparisions(startDate, endDate, type)
    let query = " SELECT COUNT(*) as totalCount FROM Distributors WHERE isActive=1 AND deleted=0";
    if (fromStart !== 'true') {
        query = " SELECT COUNT(*) as totalCount FROM Distributors WHERE isActive=1 AND deleted=0 AND DATE(createdDateTime)>=? AND DATE(createdDateTime)<=?";
        executeGetParamsQuery(query, [newStartDate, newEndDate], callback)
    }
    else executeGetParamsQuery(query, callback)
}
customerQueries.getTotalDistributors = (input, callback) => {
    let { startDate, endDate, fromStart } = input;
    let query = " SELECT COUNT(*) as totalCount FROM Distributors WHERE deleted=0";
    if (fromStart !== 'true') {
        query = " SELECT COUNT(*) as totalCount FROM Distributors WHERE deleted=0 AND DATE(createdDateTime)>=? AND DATE(createdDateTime)<=?";
        executeGetParamsQuery(query, [startDate, endDate], callback)
    }
    else executeGetParamsQuery(query, callback)
}
customerQueries.getTotalInActiveDistributors = (input, callback) => {
    let { startDate, endDate, fromStart } = input;
    let query = " SELECT COUNT(*) as totalCount FROM Distributors WHERE deleted=0 AND isActive=0";
    if (fromStart !== 'true') {
        query = " SELECT COUNT(*) as totalCount FROM Distributors WHERE deleted=0 AND isActive=0 AND DATE(createdDateTime)>=? AND DATE(createdDateTime)<=?";
        executeGetParamsQuery(query, [startDate, endDate], callback)
    }
    else executeGetParamsQuery(query, callback)
}
customerQueries.getCustomerDetailsByStatus = (status, callback) => {
    let query = "SELECT c.organizationName,c.isSuperAdminApproved,c.depositAmount,c.customertype,c.isApproved,c.customerId,c.natureOfBussiness,c.customerName,c.registeredDate,c.address1 AS address,JSON_ARRAYAGG(d.contactperson) AS contactpersons FROM customerdetails c INNER JOIN DeliveryDetails d ON c.customerId=d.customer_Id WHERE c.isApproved=? and d.deleted=0 AND c.approvedDate IS NULL GROUP BY c.organizationName,c.customerName,c.natureOfBussiness,c.address1,c.isActive,c.customerId,c.registeredDate ORDER BY c.registeredDate DESC"
    executeGetParamsQuery(query, [status], callback)
}
customerQueries.getsqlNo = (tableName, callback) => {
    let seqNoQuery = `SELECT AUTO_INCREMENT AS orderId FROM information_schema.TABLES WHERE TABLE_NAME=?`
    executeGetParamsQuery(seqNoQuery, [tableName], callback)
}
customerQueries.getTotalCustomersByDepartment = (input, callback) => {
    let { startDate, endDate, fromStart, departmentId } = input;
    let query = "SELECT COUNT(*) as totalCount FROM DeliveryDetails WHERE deleted=0 AND isActive=1 AND departmentId=?"
    if (fromStart !== 'true') {
        query = "SELECT COUNT(*) as totalCount FROM DeliveryDetails WHERE deleted=0 AND isActive=1 AND departmentId=? AND  DATE(registeredDate)>=? AND DATE(registeredDate)<=?"
        executeGetParamsQuery(query, [departmentId, startDate, endDate], callback)
    } else executeGetParamsQuery(query, [departmentId], callback)
}
customerQueries.getCorporateCustomersByDepartment = (input, callback) => {
    let { startDate, endDate, fromStart, departmentId } = input;
    let query = "SELECT COUNT(*) as totalCount FROM DeliveryDetails d INNER JOIN customerdetails c ON d.customer_Id=c.customerId WHERE d.isActive=1 AND d.deleted=0 AND d.departmentId=? AND c.customertype='Corporate'"
    if (fromStart !== 'true') {
        query = "SELECT COUNT(*) as totalCount FROM DeliveryDetails d INNER JOIN customerdetails c ON d.customer_Id=c.customerId WHERE d.isActive=1 AND d.deleted=0 AND d.departmentId=? AND c.customertype='Corporate' AND  DATE(d.registeredDate)>=? AND DATE(d.registeredDate)<=?"
        executeGetParamsQuery(query, [departmentId, startDate, endDate], callback)
    } else executeGetParamsQuery(query, [departmentId], callback)
}
customerQueries.getInActiveCustomersByDepartment = (input, callback) => {
    let { startDate, endDate, fromStart, departmentId } = input;
    let query = "SELECT COUNT(*) as totalCount FROM DeliveryDetails WHERE departmentId=? AND isActive=0 AND deleted=0 AND lastApprovedDate IS NOT NULL"
    if (fromStart !== 'true') {
        query = "SELECT COUNT(*) as totalCount FROM DeliveryDetails WHERE departmentId=? AND isActive=0 AND deleted=0 AND lastApprovedDate IS NOT NULL AND DATE(registeredDate)>=? AND DATE(registeredDate)<=?"
        executeGetParamsQuery(query, [departmentId, startDate, endDate], callback)
    }
    else executeGetParamsQuery(query, [departmentId], callback)
}
customerQueries.getCorporateCustomersChangeByDepartment = (input, callback) => {
    let { startDate, endDate, fromStart, type, departmentId } = input;
    const { startDate: newStartDate, endDate: newEndDate } = dateComparisions(startDate, endDate, type)
    let query = "SELECT COUNT(*) as totalCount FROM DeliveryDetails d INNER JOIN customerdetails c ON d.customer_Id=c.customerId WHERE d.isActive=1 AND d.deleted=0 AND d.departmentId=? AND c.customertype='Corporate'"
    if (fromStart !== 'true') {
        query = "SELECT COUNT(*) as totalCount FROM DeliveryDetails d INNER JOIN customerdetails c ON d.customer_Id=c.customerId WHERE d.isActive=1 AND d.deleted=0 AND d.departmentId=? AND c.customertype='Corporate' AND  DATE(d.registeredDate)>=? AND DATE(d.registeredDate)<=?"
        executeGetParamsQuery(query, [departmentId, newStartDate, newEndDate], callback)
    } else executeGetParamsQuery(query, [departmentId], callback)
}
customerQueries.getOtherCustomersByDepartment = (input, callback) => {
    let { startDate, endDate, fromStart, departmentId } = input;
    let query = "SELECT COUNT(*) as totalCount FROM DeliveryDetails d INNER JOIN customerdetails c ON d.customer_Id=c.customerId WHERE d.isActive=1 AND d.deleted=0 AND d.departmentId=? AND c.customertype='Individual'"
    if (fromStart !== 'true') {
        query = "SELECT COUNT(*) as totalCount FROM DeliveryDetails d INNER JOIN customerdetails c ON d.customer_Id=c.customerId WHERE d.isActive=1 AND d.deleted=0 AND d.departmentId=? AND c.customertype='Individual' AND  DATE(d.registeredDate)>=? AND DATE(d.registeredDate)<=?"
        executeGetParamsQuery(query, [departmentId, startDate, endDate], callback)
    } else executeGetParamsQuery(query, [departmentId], callback)
}
customerQueries.getOtherCustomersChangeByDepartment = (input, callback) => {
    let { startDate, endDate, fromStart, type, departmentId } = input;
    const { startDate: newStartDate, endDate: newEndDate } = dateComparisions(startDate, endDate, type)
    let query = "SELECT COUNT(*) as totalCount FROM DeliveryDetails d INNER JOIN customerdetails c ON d.customer_Id=c.customerId WHERE d.isActive=1 AND d.deleted=0 AND d.departmentId=? AND c.customertype='Individual'"
    if (fromStart !== 'true') {
        query = "SELECT COUNT(*) as totalCount FROM DeliveryDetails d INNER JOIN customerdetails c ON d.customer_Id=c.customerId WHERE d.isActive=1 AND d.deleted=0 AND d.departmentId=? AND c.customertype='Individual' AND  DATE(d.registeredDate)>=? AND DATE(d.registeredDate)<=?"
        executeGetParamsQuery(query, [departmentId, newStartDate, newEndDate], callback)
    } else executeGetParamsQuery(query, [departmentId], callback)
}

customerQueries.checkCustomerExistsOrNot = (input, callback) => {
    const { EmailId, mobileNumber } = input;
    let query = 'Select customerId from customerdetails where EmailId=? OR mobileNumber=?'
    return executeGetParamsQuery(query, [EmailId, mobileNumber], callback)
}

customerQueries.getQuotes = (callback) => {
    let query = 'Select * from quotes ORDER BY quotedDate DESC'
    return executeGetQuery(query, callback)
}

// customerQueries.getMembershipCustomers = (callback) => {
//     let query = 'Select * from membershipcustomers ORDER BY registeredDateTime DESC'
//     return executeGetQuery(query, callback)
// }

customerQueries.getBusinessRequests = (callback) => {
    let query = 'Select * from businessaccountrequests ORDER BY requestedDate DESC'
    return executeGetQuery(query, callback)
}

//POST Request Methods
customerQueries.saveCustomerOrderDetails = (input, callback) => {
    let { contactPerson, phoneNumber, address, routeId, driverId, customer_Id, latitude, longitude, dcNo, departmentId, customerType, product20L, price20L, product1L, price1L, product500ML, price500ML,
        product300ML, price300ML, product2L, price2L, deliveryLocation } = input
    let query = `insert into customerorderdetails (customerName,phoneNumber,address,routeId,driverId,existingCustomerId,latitude,longitude,dcNo,warehouseId,customerType,20LCans, price20L, 1LBoxes, price1L, 500MLBoxes, price500ML,300MLBoxes, price300ML,2LBoxes,price2L,deliveryLocation) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    let requestBody = [contactPerson, phoneNumber, address, routeId, driverId, customer_Id, latitude, longitude, dcNo, departmentId, customerType, product20L, price20L, product1L, price1L, product500ML, price500ML, product300ML, price300ML, product2L, price2L, deliveryLocation]
    executePostOrUpdateQuery(query, requestBody, callback)
}
customerQueries.approveCustomer = (input, callback) => {
    const { customerId, isSuperAdminApproved } = input
    let currentDate = new Date();
    let query = `UPDATE customerdetails set isApproved=?,approvedDate=?,lastApprovedDate=?,isSuperAdminApproved=? where customerId=?`
    let options = [isSuperAdminApproved == 1 ? 0 : 1, currentDate, currentDate, isSuperAdminApproved, customerId]
    executePostOrUpdateQuery(query, options, callback)
}

customerQueries.approveOutDeliveryDetails = (customerId, callback) => {  //If user approves from the dashboard
    let currentDate = new Date();
    let query = 'UPDATE DeliveryDetails set isActive=1,approvedDate=?,lastApprovedDate=? where customer_Id=' + customerId
    executePostOrUpdateQuery(query, [currentDate, currentDate], callback)
}

customerQueries.approveDeliveryDetails = (ids, callback) => {
    let currentDate = new Date();
    let query = 'UPDATE DeliveryDetails set isActive=1,approvedDate=?,lastApprovedDate=? where deliveryDetailsId IN (?)'
    executePostOrUpdateQuery(query, [currentDate, currentDate, ids], callback)
}
customerQueries.updateDCNo = (insertedId, callback) => {
    let query = "UPDATE customerorderdetails SET DCNO=? WHERE customerOrderId=?"
    executePostOrUpdateQuery(query, [`DC-${insertedId}`, insertedId], callback)
}
customerQueries.updateOrderDetails = (input, callback) => {
    let { routeId, driverId, customerOrderId } = input
    let query = `update customerorderdetails SET routeId=?,driverId=? where customerOrderId=${customerOrderId}`;
    let requestBody = [routeId, driverId]
    executePostOrUpdateQuery(query, requestBody, () => {
        return getDeliverysByCustomerOrderId(customerOrderId, callback)
    })
}
customerQueries.updateWHDeliveryDetails = (input, callback) => {
    let { address, boxes1L, boxes2L, boxes300ML, boxes500ML, cans20L, customerName, driverId, phoneNumber, routeId, customer_Id } = input
    // let query = `update customerorderdetails SET address=?,1LBoxes=?,2LBoxes=?,300MLBoxes=?,500MLBoxes=?,20LCans=?,customerName=?,driverId=?,phoneNumber=?,routeId=? where address=? AND isDelivered='Inprogress' AND existingCustomerId=? AND CONVERT(DATE,'deliveryDate')=?`;
    let query = `update customerorderdetails SET address=?,1LBoxes=?,2LBoxes=?,300MLBoxes=?,500MLBoxes=?,20LCans=?,customerName=?,driverId=?,phoneNumber=?,routeId=? where address=? AND isDelivered='Inprogress' AND existingCustomerId=? AND( DATE(deliveryDate) BETWEEN ? AND ?)`;
    let requestBody = [address, boxes1L, boxes2L, boxes300ML, boxes500ML, cans20L, customerName, driverId, phoneNumber, routeId, address, customer_Id, dayjs().startOf('day').format(FULLTIMEFORMAT), dayjs().endOf('day').format(FULLTIMEFORMAT)]
    executePostOrUpdateQuery(query, requestBody, callback)
}
customerQueries.updateCustomerStatus = (input, callback) => {
    let { status, customerId } = input
    let query, requestBody;
    if (status == 1) {
        query = `update customerdetails SET isApproved=?,lastApprovedDate=? where customerId=${customerId}`;
        requestBody = [status, new Date()]
    } else {
        query = `update customerdetails SET isApproved=?,lastDraftedDate=? where customerId=${customerId}`;
        requestBody = [status, new Date()]
    }
    executePostOrUpdateQuery(query, requestBody, callback)
}
customerQueries.updateCustomerDeliveriesStatus = (input, callback) => {
    let { status, customerId } = input
    let query, requestBody;
    if (status == 1) {
        query = `update DeliveryDetails SET isActive=?,lastApprovedDate=? where customer_Id=${customerId}`;
        requestBody = [status, new Date()]
    } else {
        query = `update DeliveryDetails SET isActive=?,lastDraftedDate=? where customer_Id=${customerId}`;
        requestBody = [status, new Date()]
    }
    executePostOrUpdateQuery(query, requestBody, callback)
}
customerQueries.updateCustomerDeliveryStatus = (input, callback) => {
    let { status, deliveryDetailsId } = input
    let query, requestBody;
    if (status == 1) {
        query = `update DeliveryDetails SET isActive=?,lastApprovedDate=? where deliveryDetailsId=${deliveryDetailsId}`;
        requestBody = [status, new Date()]
    } else {
        query = `update DeliveryDetails SET isActive=?,lastDraftedDate=? where deliveryDetailsId=${deliveryDetailsId}`;
        requestBody = [status, new Date()]
    }
    executePostOrUpdateQuery(query, requestBody, callback)
}
customerQueries.deleteCustomer = (customerId, callback) => {
    let query = `update customerdetails SET deleted=? where customerId=${customerId}`;
    let requestBody = [1]
    executePostOrUpdateQuery(query, requestBody, callback)
}
customerQueries.deleteCustomerDeliveries = (customerId, callback) => {
    let query = `update DeliveryDetails SET deleted=? where customer_Id=${customerId}`;
    let requestBody = [1]
    executePostOrUpdateQuery(query, requestBody, callback)
}
customerQueries.generatePDF = (input, callback) => {
    const { fromDate, toDate, customerIds } = input
    let query = `SELECT c.gstNo,c.customerId,c.createdBy,c.EmailId,c.customerName,c.organizationName,
    c.address1,c.gstNo,c.panNo,c.mobileNumber,
    JSON_ARRAYAGG(JSON_OBJECT('deliveryAddress',co.address,'location',co.deliveryLocation,'20LCans',co.20LCans,'price20L',co.price20L,'1LBoxes',co.1LBoxes,
    'price1L',co.price1L, '500MLBoxes',co.500MLBoxes,'price500ML',co.price500ML,'300MLBoxes',co.300MLBoxes,'price300ML',co.price300ML,'2LBoxes',co.2LBoxes,'price2L',co.price2L)) as products
    FROM customerdetails c INNER JOIN  customerorderdetails co ON c.customerId=co.existingCustomerId
    INNER JOIN DeliveryDetails d ON d.customer_Id=c.customerId  WHERE c.invoicetype!='complimentary' AND co.isDelivered='Completed' AND customerId NOT IN (SELECT customerId FROM Invoice WHERE fromdate=? AND todate=?)
    AND( DATE(co.deliveryDate) BETWEEN ? AND ?) GROUP BY c.customerId`
    let options = [fromDate, toDate, fromDate, toDate]
    if (customerIds.length) {
        query = `SELECT c.gstNo,c.customerId,c.createdBy,c.EmailId,c.customerName,c.organizationName,
        c.address1,c.gstNo,c.panNo,c.mobileNumber,
        JSON_ARRAYAGG(JSON_OBJECT('deliveryAddress',co.address,'location',co.deliveryLocation,'20LCans',co.20LCans,'price20L',co.price20L,'1LBoxes',co.1LBoxes,
        'price1L',co.price1L, '500MLBoxes',co.500MLBoxes,'price500ML',co.price500ML,'300MLBoxes',co.300MLBoxes,'price300ML',co.price300ML,'2LBoxes',co.2LBoxes,'price2L',co.price2L)) as products
        FROM customerdetails c INNER JOIN  customerorderdetails co ON c.customerId=co.existingCustomerId
        INNER JOIN DeliveryDetails d ON d.customer_Id=c.customerId  WHERE c.invoicetype!='complimentary' AND co.isDelivered='Completed' AND customerId NOT IN (SELECT customerId FROM Invoice WHERE fromdate=? AND todate=?)
        AND( DATE(co.deliveryDate) BETWEEN ? AND ?) AND c.customerId IN (?) GROUP BY c.customerId`
        options = [fromDate, toDate, fromDate, toDate, customerIds]
    }
    // "SELECT c.gstNo,c.customerId,c.creditPeriodInDays,c.createdBy,c.EmailId,c.customerName,c.organizationName,c.address1,d.address,c.gstNo,c.panNo,c.mobileNumber,co.20LCans,co.price20L,co.1LBoxes,co.price1L, co.500MLBoxes,co.price500ML,co.300MLBoxes,co.price300ML,co.2LBoxes,co.price2L FROM customerdetails c INNER JOIN  customerorderdetails co ON c.customerId=co.existingCustomerId INNER JOIN DeliveryDetails d ON d.customer_Id=c.customerId  WHERE co.isDelivered='Completed' AND( DATE(co.deliveryDate) BETWEEN ? AND ?)"
    return executeGetParamsQuery(query, options, callback)
}
customerQueries.deleteDeliveryAddress = (deliveryId, callback) => {
    let query = "update DeliveryDetails set deleted=1 where deliveryDetailsId=?"
    executePostOrUpdateQuery(query, [deliveryId], callback)
}
customerQueries.updateOrderDelivery = (input, callback) => {
    const { driverId, routeId, vehicleId, deliveryDetailsId } = input
    let query = "update DeliveryDetails set driverId=?,routeId=?,vehicleId=? where deliveryDetailsId=?"
    executePostOrUpdateQuery(query, [driverId, routeId, vehicleId, deliveryDetailsId], () => {
        let getQuery = 'SELECT d.registeredDate,d.location,d.contactPerson,d.deliveryDetailsId,d.isActive as isApproved,d.vehicleId,r.routeName,r.routeId,dri.driverName,dri.driverId,dri.mobileNumber FROM DeliveryDetails d INNER JOIN routes r ON d.routeId=r.routeId left JOIN driverdetails dri ON d.driverId=dri.driverid WHERE d.deliveryDetailsId=' + deliveryDetailsId
        return executeGetQuery(getQuery, callback)
    })
}
customerQueries.generateCustomerPDF = (input, callback) => {
    const { fromDate, toDate, customerId } = input
    let query = `SELECT c.gstNo,c.customerId,c.createdBy,c.EmailId,c.customerName,c.organizationName,
    c.address1,c.gstNo,c.panNo,c.mobileNumber,
    JSON_ARRAYAGG(JSON_OBJECT('deliveryAddress',d.address,'location',d.location,'20LCans',co.20LCans,'price20L',co.price20L,'1LBoxes',co.1LBoxes,
    'price1L',co.price1L, '500MLBoxes',co.500MLBoxes,'price500ML',co.price500ML,'300MLBoxes',co.300MLBoxes,'price300ML',co.price300ML,'2LBoxes',co.2LBoxes,'price2L',co.price2L)) as products
    FROM customerdetails c INNER JOIN  customerorderdetails co ON c.customerId=co.existingCustomerId
    INNER JOIN DeliveryDetails d ON d.customer_Id=c.customerId  WHERE c.invoicetype!='complimentary' AND co.isDelivered='Completed' AND customerId NOT IN (SELECT customerId FROM Invoice WHERE fromDate=? AND toDate=?)
    AND( DATE(co.deliveryDate) BETWEEN ? AND ?) AND c.customerId=?`
    // "SELECT c.gstNo,c.customerId,c.creditPeriodInDays,c.createdBy,c.EmailId,c.customerName,c.organizationName,c.address1,d.address,c.gstNo,c.panNo,c.mobileNumber,co.20LCans,co.price20L,co.1LBoxes,co.price1L, co.500MLBoxes,co.price500ML,co.300MLBoxes,co.price300ML,co.2LBoxes,co.price2L FROM customerdetails c INNER JOIN  customerorderdetails co ON c.customerId=co.existingCustomerId INNER JOIN DeliveryDetails d ON d.customer_Id=c.customerId  WHERE co.isDelivered='Completed' AND( DATE(co.deliveryDate) BETWEEN ? AND ?)"
    return executeGetParamsQuery(query, [fromDate, toDate, fromDate, toDate, customerId], callback)
}

customerQueries.createAdhocUser = (input, callback) => {
    const { customerName, phoneNumber, EmailId, address, contactperson, registeredDate = new Date(), natureOfBussiness = 'Others', isActive = 0, customertype = 'Individual' } = input
    let query = "insert  into customerdetails (customerName,mobileNumber,EmailId,Address1,contactperson,registeredDate,natureOfBussiness,isActive,customertype,isAdhocUser) values(?,?,?,?,?,?,?,?,?,?)";
    let requestBody = [customerName, phoneNumber, EmailId, address, contactperson, registeredDate, natureOfBussiness, isActive, customertype, 1]
    return executePostOrUpdateQuery(query, requestBody, callback)
}

customerQueries.createQuote = (input, callback) => {
    const { product20L, product2L, product1L, product500ML, product300ML, customerName, email, mobileNumber, quotedDate = new Date() } = input
    let query = "insert  into quotes (20LCans,1LBoxes,500MLBoxes,300MLBoxes,2LBoxes,customerName,email,mobileNumber,quotedDate) values(?,?,?,?,?,?,?,?,?)";
    let requestBody = [product20L, product2L, product1L, product500ML, product300ML, customerName, email, mobileNumber, quotedDate]
    return executePostOrUpdateQuery(query, requestBody, callback)
}

customerQueries.createMembershipCustomer = (input, callback) => {
    const { product20L, product2L, product1L, product500ML, product300ML, customerName, email, mobileNumber, registeredDateTime = new Date(), pincode, address, landmark } = input
    let query = "insert  into membershipcustomers (20LCans,1LBoxes,500MLBoxes,300MLBoxes,2LBoxes,customerName,email,mobileNumber,registeredDateTime,pincode,address,landmark) values(?,?,?,?,?,?,?,?,?,?,?,?)";
    let requestBody = [product20L, product2L, product1L, product500ML, product300ML, customerName, email, mobileNumber, registeredDateTime, pincode, address, landmark]
    return executePostOrUpdateQuery(query, requestBody, callback)
}

customerQueries.createBusinessRequest = (input, callback) => {
    const { organizationName, email, mobileNumber, requestedDate = new Date(), pincode, address, address2, natureOfBussiness } = input
    let query = "insert  into businessaccountrequests (organizationName,email,mobileNumber,requestedDate,pincode,address,address2,natureOfBussiness) values(?,?,?,?,?,?,?,?)";
    let requestBody = [organizationName, email, mobileNumber, requestedDate, pincode, address, address2, natureOfBussiness]
    return executePostOrUpdateQuery(query, requestBody, callback)
}

module.exports = customerQueries