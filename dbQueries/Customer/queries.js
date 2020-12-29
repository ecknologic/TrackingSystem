const { executeGetQuery, executeGetParamsQuery, executePostOrUpdateQuery } = require('../../utils/functions.js');
let customerQueries = {}

customerQueries.getCustomerDetails = (customerId, callback) => {
    let query = "SELECT customerId,customerName,mobileNumber,EmailId,Address1,gstNo,panNo,adharNo,registeredDate,invoicetype,natureOfBussiness,creditPeriodInDays,referredBy,isActive,customertype,organizationName,idProofType,customer_id_proof,d.idProof_backside,d.idProof_frontside,d.gstProof from customerdetails c INNER JOIN customerDocStore d ON c.customer_id_proof=d.docId WHERE c.customerId=" + customerId
    executeGetQuery(query, callback)
}
customerQueries.getsqlNo = (tableName, callback) => {
    let seqNoQuery = `SELECT AUTO_INCREMENT AS orderId FROM information_schema.TABLES WHERE TABLE_NAME=?`
    executeGetParamsQuery(seqNoQuery, [tableName], callback)
}
//POST Request Methods
customerQueries.saveCustomerOrderDetails = (input, callback) => {
    let { customerName, phoneNumber, address, routeId, driverId, customer_Id, latitude, longitude, dcNo, departmentId, customerType, product20L, price20L, product1L, price1L, product500ML, price500ML,
        product250ML, price250ML } = input
    let query = `insert into customerorderdetails (customerName,phoneNumber,address,routeId,driverId,existingCustomerId,latitude,longitude,dcNo,warehouseId,customerType,20LCans, price20L, 1LBoxes, price1L, 500MLBoxes, price500ML,250MLBoxes, price250ML) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    let requestBody = [customerName, phoneNumber, address, routeId, driverId, customer_Id, latitude, longitude, dcNo, departmentId, customerType, product20L, price20L, product1L, price1L, product500ML, price500ML, product250ML, price250ML]
    executePostOrUpdateQuery(query, requestBody, callback)
}

module.exports = customerQueries