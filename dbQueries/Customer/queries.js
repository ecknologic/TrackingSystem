const { executeGetQuery, executeGetParamsQuery, executePostOrUpdateQuery } = require('../../utils/functions.js');
let customerQueries = {}

customerQueries.getCustomerDetails = (customerId, callback) => {
    let query = "SELECT customerId,customerName,mobileNumber,EmailId,Address1,gstNo,panNo,adharNo,registeredDate,invoicetype,natureOfBussiness,creditPeriodInDays,referredBy,isApproved,customertype,organizationName,idProofType,customer_id_proof,d.idProof_backside,d.idProof_frontside,d.gstProof from customerdetails c INNER JOIN customerDocStore d ON c.customer_id_proof=d.docId WHERE c.customerId=" + customerId
    executeGetQuery(query, callback)
}
customerQueries.getOrdersByDepartmentId = (departmentId, callback) => {
    let query = "SELECT d.location,d.contactPerson,d.deliveryDetailsId,d.isActive as isApproved,r.routeName FROM DeliveryDetails d INNER JOIN routes r ON d.routeId=r.routeId WHERE d.deleted=0 AND d.departmentId=? ORDER BY d.registeredDate DESC";
    executeGetParamsQuery(query, [departmentId], callback)
}
customerQueries.getRoutesByDepartmentId = (departmentId, callback) => {
    let query = "SELECT RouteId,RouteName from routes WHERE departmentId=" + departmentId
    executeGetQuery(query, callback)
}
customerQueries.getCustomersByCustomerType = (customerType, callback) => {
    let query = "SELECT c.organizationName,c.isActive,c.isApproved,c.customerId,c.natureOfBussiness,c.customerName,c.registeredDate,c.approvedDate,c.address1 AS address,JSON_ARRAYAGG(d.contactperson) AS contactpersons FROM customerdetails c INNER JOIN DeliveryDetails d ON c.customerId=d.customer_Id WHERE c.customertype=? and c.isApproved=1 and d.deleted=0  GROUP BY c.organizationName,c.customerName,c.natureOfBussiness,c.address1,c.isActive,c.isApproved,c.customerId,c.registeredDate,c.approvedDate ORDER BY c.approvedDate DESC"
    executeGetParamsQuery(query, [customerType], callback)
}
customerQueries.getCustomerDetailsByStatus = (status, callback) => {
    let query = "SELECT c.organizationName,c.isActive,c.customerId,c.natureOfBussiness,c.customerName,c.registeredDate,c.address1 AS address,JSON_ARRAYAGG(d.contactperson) AS contactpersons FROM customerdetails c INNER JOIN DeliveryDetails d ON c.customerId=d.customer_Id WHERE c.isApproved=? and d.deleted=0  GROUP BY c.organizationName,c.customerName,c.natureOfBussiness,c.address1,c.isActive,c.customerId,c.registeredDate ORDER BY c.registeredDate DESC"
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
customerQueries.deleteDeliveryAddress = (deliveryId, callback) => {
    let query = "update DeliveryDetails set deleted=1 where deliveryDetailsId=?"
    executePostOrUpdateQuery(query, [deliveryId], callback)
}
customerQueries.updateOrderDelivery = (input, callback) => {
    const { driverId, routeId, vehicleId, deliveryDetailsId } = input
    let query = "update DeliveryDetails set driverId=?,routeId=?,vehicleId=? where deliveryDetailsId=?"
    executePostOrUpdateQuery(query, [driverId, routeId, vehicleId, deliveryDetailsId], callback)
}
module.exports = customerQueries