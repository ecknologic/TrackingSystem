const { executeGetQuery, executeGetParamsQuery, executePostOrUpdateQuery } = require('../../utils/functions.js');
const { getDeliverysByCustomerOrderId } = require('../warehouse/queries.js');
let customerQueries = {}

customerQueries.getCustomerDetails = (customerId, callback) => {
    let query = "SELECT isSuperAdminApproved,rocNo,depositAmount,customerId,customerName,c.mobileNumber,c.EmailId,c.Address1,c.gstNo,c.panNo,c.adharNo,c.registeredDate,c.invoicetype,c.natureOfBussiness,c.creditPeriodInDays,referredBy,isApproved,customertype,organizationName,idProofType,pincode, dispenserCount, contractPeriod,customer_id_proof,d.idProof_backside,d.idProof_frontside,d.gstProof,u.userName as createdUserName from customerdetails c INNER JOIN customerDocStore d ON c.customer_id_proof=d.docId INNER JOIN usermaster u ON u.userId=c.createdBy WHERE c.customerId=" + customerId
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
customerQueries.getTotalActiveCustomers = (input, callback) => {
    let { startDate, endDate, fromStart } = input;
    let query = "SELECT COUNT(*) as totalCount FROM customerdetails WHERE isApproved=1 AND deleted=0"
    if (fromStart !== 'true') {
        query = "SELECT COUNT(*) as totalCount FROM customerdetails WHERE isApproved=1 AND deleted=0 AND  DATE(createdDateTime)>=? AND DATE(createdDateTime)<=?"
        executeGetParamsQuery(query, [startDate, endDate], callback)
    } else executeGetParamsQuery(query, callback)
}
customerQueries.getTotalActiveCorporateCustomers = (input, callback) => {
    let { startDate, endDate, fromStart } = input;
    let query = "SELECT COUNT(*) as totalCount FROM customerdetails WHERE isApproved=1 AND deleted=0 AND customertype='Corporate'"
    if (fromStart !== 'true') {
        query = "SELECT COUNT(*) as totalCount FROM customerdetails WHERE isApproved=1 AND deleted=0 AND customertype='Corporate' AND  DATE(createdDateTime)>=? AND DATE(createdDateTime)<=?"
        executeGetParamsQuery(query, [startDate, endDate], callback)
    } else executeGetParamsQuery(query, callback)
}
customerQueries.getTotalActiveCustomers = (input, callback) => {
    let { startDate, endDate, fromStart } = input;
    let query = "SELECT COUNT(*) as totalCount FROM customerdetails WHERE isApproved=1 AND deleted=0"
    if (fromStart !== 'true') {
        query = "SELECT COUNT(*) as totalCount FROM customerdetails WHERE isApproved=1 AND deleted=0 AND  DATE(createdDateTime)>=? AND DATE(createdDateTime)<=?"
        executeGetParamsQuery(query, [startDate, endDate], callback)
    }
    else executeGetParamsQuery(query, callback)
}
customerQueries.getTotalInActiveCustomers = (input, callback) => {
    let { startDate, endDate, fromStart } = input;
    let query = "SELECT COUNT(*) as totalCount FROM customerdetails WHERE isApproved=1 AND deleted=0 AND approvedDate!='NULL'"
    if (fromStart !== 'true') {
        query = "SELECT COUNT(*) as totalCount FROM customerdetails WHERE isApproved=1 AND deleted=0 AND approvedDate!='NULL' AND DATE(createdDateTime)>=? AND DATE(createdDateTime)<=?"
        executeGetParamsQuery(query, [startDate, endDate], callback)
    }
    else executeGetParamsQuery(query, callback)
}
customerQueries.getTotalPendingCorporateCustomers = (input, callback) => {
    let { startDate, endDate, fromStart } = input;
    let query = "SELECT COUNT(*) as totalCount FROM customerdetails WHERE isApproved=0 AND approvedDate IS NULL AND deleted=0 AND customertype='Corporate'"
    if (fromStart !== 'true') {
        query = "SELECT COUNT(*) as totalCount FROM customerdetails WHERE isApproved=0 AND approvedDate IS NULL AND deleted=0 AND customertype='Corporate' AND DATE(createdDateTime)>=? AND DATE(createdDateTime)<=?"
        executeGetParamsQuery(query, [startDate, endDate], callback)
    }
    else executeGetParamsQuery(query, callback)
}
customerQueries.getTotalActiveOtherCustomers = (input, callback) => {
    let { startDate, endDate, fromStart } = input;
    let query = "SELECT COUNT(*) as totalCount FROM customerdetails WHERE isApproved=1 AND deleted=0 AND customertype='Individual'"
    if (fromStart !== 'true') {
        query = "SELECT COUNT(*) as totalCount FROM customerdetails WHERE isApproved=1 AND deleted=0 AND customertype='Individual' AND DATE(createdDateTime)>=? AND DATE(createdDateTime)<=?"
        executeGetParamsQuery(query, [startDate, endDate], callback)
    }
    else executeGetParamsQuery(query, callback)
}
customerQueries.getTotalPendingOtherCustomers = (input, callback) => {
    let { startDate, endDate, fromStart } = input;
    let query = "SELECT COUNT(*) as totalCount FROM customerdetails WHERE isApproved=0 AND approvedDate IS NULL AND deleted=0 AND customertype='Individual'"
    if (fromStart !== 'true') {
        query = "SELECT COUNT(*) as totalCount FROM customerdetails WHERE isApproved=0 AND approvedDate IS NULL AND deleted=0 AND customertype='Individual' AND DATE(createdDateTime)>=? AND DATE(createdDateTime)<=?"
        executeGetParamsQuery(query, [startDate, endDate], callback)
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
customerQueries.getCustomerDetailsByStatus = (status, callback) => {
    let query = "SELECT c.organizationName,c.customertype,c.isActive,c.customerId,c.natureOfBussiness,c.customerName,c.registeredDate,c.address1 AS address,JSON_ARRAYAGG(d.contactperson) AS contactpersons FROM customerdetails c INNER JOIN DeliveryDetails d ON c.customerId=d.customer_Id WHERE c.isApproved=? and d.deleted=0 AND c.approvedDate IS NULL GROUP BY c.organizationName,c.customerName,c.natureOfBussiness,c.address1,c.isActive,c.customerId,c.registeredDate ORDER BY c.registeredDate DESC"
    executeGetParamsQuery(query, [status], callback)
}
customerQueries.getsqlNo = (tableName, callback) => {
    let seqNoQuery = `SELECT AUTO_INCREMENT AS orderId FROM information_schema.TABLES WHERE TABLE_NAME=?`
    executeGetParamsQuery(seqNoQuery, [tableName], callback)
}
//POST Request Methods
customerQueries.saveCustomerOrderDetails = (input, callback) => {
    let { contactPerson, phoneNumber, address, routeId, driverId, customer_Id, latitude, longitude, dcNo, departmentId, customerType, product20L, price20L, product1L, price1L, product500ML, price500ML,
        product250ML, price250ML, deliveryLocation } = input
    let query = `insert into customerorderdetails (customerName,phoneNumber,address,routeId,driverId,existingCustomerId,latitude,longitude,dcNo,warehouseId,customerType,20LCans, price20L, 1LBoxes, price1L, 500MLBoxes, price500ML,250MLBoxes, price250ML,deliveryLocation) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    let requestBody = [contactPerson, phoneNumber, address, routeId, driverId, customer_Id, latitude, longitude, dcNo, departmentId, customerType, product20L, price20L, product1L, price1L, product500ML, price500ML, product250ML, price250ML, deliveryLocation]
    executePostOrUpdateQuery(query, requestBody, callback)
}
customerQueries.approveCustomer = (input, callback) => {
    const { customerId, isSuperAdminApproved } = input
    let query = `UPDATE customerdetails set isApproved=?,approvedDate=?,lastApprovedDate=?,isSuperAdminApproved=? where customerId=?`
    let options = [isSuperAdminApproved == 1 ? 0 : 1, new Date(), new Date(), isSuperAdminApproved, customerId]
    executePostOrUpdateQuery(query, options, callback)
}
customerQueries.approveDeliveryDetails = (ids, callback) => {
    let query = 'UPDATE DeliveryDetails set isActive=1,approvedDate=? where deliveryDetailsId IN (?)'
    executePostOrUpdateQuery(query, [ids, new Date()], callback)
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
    const { customerId = 222, fromDate = '2021-01-21', toDate = '2021-02-05' } = input
    let query = "SELECT c.customerId,c.customerName,c.organizationName,c.address1,d.address,c.gstNo,c.panNo,c.mobileNumber,co.20LCans,co.price20L,co.1LBoxes,co.price1L, co.500MLBoxes,co.price500ML,co.250MLBoxes,co.price250ML FROM customerdetails c INNER JOIN  customerorderdetails co ON c.customerId=co.existingCustomerId INNER JOIN DeliveryDetails d ON d.customer_Id=c.customerId  WHERE c.customerId=?  AND co.isDelivered='Completed' AND( DATE(co.deliveryDate) BETWEEN ? AND ?)"
    return executeGetParamsQuery(query, [customerId, fromDate, toDate], callback)
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
module.exports = customerQueries