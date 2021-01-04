const { executeGetQuery, executeGetParamsQuery, executePostOrUpdateQuery } = require('../../utils/functions.js');
let customerQueries = {}

customerQueries.getCustomerDetails = (customerId, callback) => {
    let query = "SELECT customerId,customerName,mobileNumber,EmailId,Address1,gstNo,panNo,adharNo,registeredDate,invoicetype,natureOfBussiness,creditPeriodInDays,referredBy,isActive,customertype,organizationName,idProofType,customer_id_proof,d.idProof_backside,d.idProof_frontside,d.gstProof from customerdetails c INNER JOIN customerDocStore d ON c.customer_id_proof=d.docId WHERE c.customerId=" + customerId
    executeGetQuery(query, callback)
}
customerQueries.getCustomersByCustomerType = (customerType, callback) => {
    let query = "SELECT c.organizationName,c.isActive,c.isApproved,c.customerId,c.natureOfBussiness,c.customerName,c.registeredDate,c.address1 AS address,JSON_ARRAYAGG(d.contactperson) AS contactpersons FROM customerdetails c INNER JOIN DeliveryDetails d ON c.customerId=d.customer_Id WHERE c.customertype=? and c.isApproved=1  GROUP BY c.organizationName,c.customerName,c.natureOfBussiness,c.address1,c.isActive,c.isApproved,c.customerId,c.registeredDate ORDER BY c.registeredDate DESC"
    executeGetParamsQuery(query, [customerType], callback)
}
customerQueries.getCustomerDetailsByStatus = (status, callback) => {
    let query = "SELECT c.organizationName,c.isActive,c.customerId,c.natureOfBussiness,c.customerName,c.registeredDate,c.address1 AS address,JSON_ARRAYAGG(d.contactperson) AS contactpersons FROM customerdetails c INNER JOIN DeliveryDetails d ON c.customerId=d.customer_Id WHERE c.isApproved=?  GROUP BY c.organizationName,c.customerName,c.natureOfBussiness,c.address1,c.isActive,c.customerId,c.registeredDate ORDER BY c.registeredDate DESC"
    console.log(query, status)
    executeGetParamsQuery(query, [status], callback)
}
customerQueries.getsqlNo = (tableName, callback) => {
    let seqNoQuery = `SELECT AUTO_INCREMENT AS orderId FROM information_schema.TABLES WHERE TABLE_NAME=?`
    executeGetParamsQuery(seqNoQuery, [tableName], callback)
}
//POST Request Methods
customerQueries.saveCustomerOrderDetails = (input, callback) => {
    let { contactPerson, phoneNumber, address, routeId, driverId, customer_Id, latitude, longitude, dcNo, departmentId, customerType, product20L, price20L, product1L, price1L, product500ML, price500ML,
        product250ML, price250ML } = input
    let query = `insert into customerorderdetails (customerName,phoneNumber,address,routeId,driverId,existingCustomerId,latitude,longitude,dcNo,warehouseId,customerType,20LCans, price20L, 1LBoxes, price1L, 500MLBoxes, price500ML,250MLBoxes, price250ML) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    let requestBody = [contactPerson, phoneNumber, address, routeId, driverId, customer_Id, latitude, longitude, dcNo, departmentId, customerType, product20L, price20L, product1L, price1L, product500ML, price500ML, product250ML, price250ML]
    executePostOrUpdateQuery(query, requestBody, callback)
}
customerQueries.approveCustomer = (customerId, callback) => {
    let query = `UPDATE customerdetails set isApproved=1 where customerId=?`
    executePostOrUpdateQuery(query, [customerId], callback)
}
customerQueries.approveDeliveryDetails = (ids, callback) => {
    let query = 'UPDATE DeliveryDetails set isActive=1 where deliveryDetailsId IN (?)'
    executePostOrUpdateQuery(query, [ids], callback)
}
customerQueries.deleteDeliveryAddress = (deliveryId, callback) => {
    let query = "update DeliveryDetails set deleted=1 where deliveryDetailsId=?"
    executePostOrUpdateQuery(query, [deliveryId], callback)
}
module.exports = customerQueries