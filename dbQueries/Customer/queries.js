const { executeGetQuery, executeGetParamsQuery, executePostOrUpdateQuery } = require('../../utils/functions.js');
const { getDeliverysByCustomerOrderId } = require('../warehouse/queries.js');
let customerQueries = {}

customerQueries.getCustomerDetails = (customerId, callback) => {
    let query = "SELECT customerId,customerName,mobileNumber,EmailId,Address1,gstNo,panNo,adharNo,registeredDate,invoicetype,natureOfBussiness,creditPeriodInDays,referredBy,isApproved,customertype,organizationName,idProofType,customer_id_proof,d.idProof_backside,d.idProof_frontside,d.gstProof from customerdetails c INNER JOIN customerDocStore d ON c.customer_id_proof=d.docId WHERE c.customerId=" + customerId
    executeGetQuery(query, callback)
}
customerQueries.getOrdersByDepartmentId = (departmentId, callback) => {
    let query = "SELECT d.registeredDate,d.location,d.contactPerson,d.deliveryDetailsId,d.isActive as isApproved,d.vehicleId,r.routeName,r.routeId,dri.driverName,dri.driverId,dri.mobileNumber FROM DeliveryDetails d INNER JOIN routes r ON d.routeId=r.routeId left JOIN driverdetails dri ON d.driverId=dri.driverid WHERE d.deleted=0 AND d.departmentId=? ORDER BY d.registeredDate DESC";
    executeGetParamsQuery(query, [departmentId], callback)
}
customerQueries.getRoutesByDepartmentId = (departmentId, callback) => {
    let query = `SELECT r.RouteId,r.RouteName,r.RouteDescription,d.departmentName from routes r INNER JOIN departmentmaster d ON d.departmentId=r.departmentId WHERE r.departmentId=${departmentId} AND r.deleted='0' ORDER BY r.createdDateTime DESC`
    executeGetQuery(query, callback)
}
customerQueries.getCustomersByCustomerType = (customerType, callback) => {
    let query = "SELECT c.organizationName,c.isActive,c.customertype,c.isApproved,c.customerId,c.natureOfBussiness,c.customerName,c.registeredDate,c.approvedDate,c.address1 AS address,JSON_ARRAYAGG(d.contactperson) AS contactpersons FROM customerdetails c INNER JOIN DeliveryDetails d ON c.customerId=d.customer_Id WHERE c.customertype=? and c.isApproved=1 and d.deleted=0  GROUP BY c.organizationName,c.customerName,c.natureOfBussiness,c.address1,c.isActive,c.isApproved,c.customerId,c.registeredDate,c.approvedDate ORDER BY c.approvedDate DESC"
    executeGetParamsQuery(query, [customerType], callback)
}
customerQueries.getCustomerDetailsByStatus = (status, callback) => {
    let query = "SELECT c.organizationName,c.customertype,c.isActive,c.customerId,c.natureOfBussiness,c.customerName,c.registeredDate,c.address1 AS address,JSON_ARRAYAGG(d.contactperson) AS contactpersons FROM customerdetails c INNER JOIN DeliveryDetails d ON c.customerId=d.customer_Id WHERE c.isApproved=? and d.deleted=0  GROUP BY c.organizationName,c.customerName,c.natureOfBussiness,c.address1,c.isActive,c.customerId,c.registeredDate ORDER BY c.registeredDate DESC"
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
customerQueries.approveCustomer = (customerId, callback) => {
    let query = `UPDATE customerdetails set isApproved=1,approvedDate=? where customerId=?`
    executePostOrUpdateQuery(query, [new Date(), customerId], callback)
}
customerQueries.approveDeliveryDetails = (ids, callback) => {
    let query = 'UPDATE DeliveryDetails set isActive=1 where deliveryDetailsId IN (?)'
    executePostOrUpdateQuery(query, [ids], callback)
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
    let query = `update customerdetails SET isApproved=? where customerId=${customerId}`;
    let requestBody = [status]
    executePostOrUpdateQuery(query, requestBody, callback)
}
customerQueries.updateCustomerDeliveriesStatus = (input, callback) => {
    let { status, customerId } = input
    let query = `update DeliveryDetails SET isActive=? where customer_Id=${customerId}`;
    let requestBody = [status]
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
    const { customerId = 186, fromDate = '2021-01-01', toDate = '2021-01-17' } = input
    let query = "SELECT c.customerId,c.customerName,c.organizationName,c.address1,d.address,c.gstNo,co.20LCans,co.price20L,co.1LBoxes,co.price1L, co.500MLBoxes,co.price500ML,co.250MLBoxes,co.price250ML FROM customerdetails c INNER JOIN  customerorderdetails co ON c.customerId=co.existingCustomerId INNER JOIN DeliveryDetails d ON d.customer_Id=c.customerId  WHERE c.customerId=?  AND co.isDelivered='Completed' AND( DATE(co.deliveryDate) BETWEEN ? AND ?)"
    return executeGetParamsQuery(query, [customerId, fromDate, toDate], callback)
}
customerQueries.deleteDeliveryAddress = (deliveryId, callback) => {
    let query = "update DeliveryDetails set deleted=1 where deliveryDetailsId=?"
    executePostOrUpdateQuery(query, [deliveryId], callback)
}
customerQueries.updateOrderDelivery = (input, callback) => {
    const { driverId, routeId, vehicleId, deliveryDetailsId } = input
    let query = "update DeliveryDetails set driverId=?,routeId=?,vehicleId=? where deliveryDetailsId=?"
    executePostOrUpdateQuery(query, [driverId, routeId, vehicleId, deliveryDetailsId])
    let getQuery = 'SELECT d.registeredDate,d.location,d.contactPerson,d.deliveryDetailsId,d.isActive as isApproved,d.vehicleId,r.routeName,r.routeId,dri.driverName,dri.driverId,dri.mobileNumber FROM DeliveryDetails d INNER JOIN routes r ON d.routeId=r.routeId left JOIN driverdetails dri ON d.driverId=dri.driverid WHERE d.deliveryDetailsId=' + deliveryDetailsId
    return executeGetQuery(getQuery, callback)
}
module.exports = customerQueries