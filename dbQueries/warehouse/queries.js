const { executeGetQuery, executeGetParamsQuery, executePostOrUpdateQuery } = require('../../utils/functions.js');
let warehouseQueries = {}

warehouseQueries.getWarehouseList = async (callback) => {
    let query = `select d.departmentId,d.departmentName,d.address,d.state,d.city,d.isApproved,u.userName as adminName,u.emailid as adminEmail,u.mobileNumber as adminNumber from departmentmaster d INNER JOIN usermaster u on d.adminId=u.userId WHERE d.departmentType='Warehouse' AND d.deleted='0' ORDER BY d.createdDateTime DESC`;
    return executeGetQuery(query, callback)
}
warehouseQueries.getDeliveryDetails = (input, callback) => {
    const { date, departmentId } = input
    let query = "select c.customerOrderId,c.customerName,c.phoneNumber,c.address,c.routeId,c.driverId,c.isDelivered,c.dcNo,c.20LCans AS cans20L,c.1LBoxes AS boxes1L,c.500MLBoxes AS boxes500ML,c.250MLBoxes AS boxes250ML,r.*,d.driverName,d.mobileNumber FROM customerorderdetails c INNER JOIN routes r  ON c.routeId=r.routeid left JOIN driverdetails d ON c.driverId=d.driverid  WHERE DATE(`deliveryDate`) = ? AND warehouseId=? ORDER BY c.dcNo DESC";
    return executeGetParamsQuery(query, [date, departmentId], callback)
}
warehouseQueries.getDeliverysByCustomerOrderId = (customerOrderId, callback) => {
    let query = "select c.customerOrderId,c.customerName,c.phoneNumber,c.address,c.routeId,c.driverId,c.isDelivered,c.dcNo,c.20LCans AS cans20L,c.1LBoxes AS boxes1L,c.500MLBoxes AS boxes500ML,c.250MLBoxes AS boxes250ML,r.*,d.driverName,d.mobileNumber FROM customerorderdetails c INNER JOIN routes r  ON c.routeId=r.routeid left JOIN driverdetails d ON c.driverId=d.driverid  WHERE customerOrderId=" + customerOrderId;
    return executeGetQuery(query, callback)
}
warehouseQueries.getWarehouseById = async (warehouseId, callback) => {
    let query = `select d.*,u.userName,u.mobileNumber,u.emailid,u.RoleId as roleId from departmentmaster d INNER JOIN usermaster u on d.adminId=u.userId WHERE d.departmentId=${warehouseId}`;
    return executeGetQuery(query, callback)
}
warehouseQueries.getOrderDetailsByDepartment = async (departmentId, callback) => {
    let query = `select d.deliveryDetailsId,d.address,r.RouteName from DeliveryDetails d INNER JOIN routes r ON d.routeId=r.routeId WHERE d.departmentId=? AND d.deleted=0 AND d.isActive=1`;
    return executeGetParamsQuery(query, [departmentId], callback)
}
warehouseQueries.getReturnedEmptyCans = async (warehouseId, callback) => {
    let query = "SELECT (SELECT SUM(c.returnemptycans) FROM customerorderdetails c WHERE c.warehouseid=?)-(SELECT SUM(e.emptycans_count)  FROM EmptyCanDetails e  WHERE e.isconfirmed=1 AND e.warehouseId=?) AS emptycans";
    return executeGetParamsQuery(query, [warehouseId, warehouseId], callback)
}

//POST Request Methods
warehouseQueries.saveWarehouseStockDetails = (input, callback) => {
    const { isDamaged, departmentId, total20LCans, total1LBoxes, total250MLBoxes, total500MLBoxes, damaged500MLBoxes, damaged250MLBoxes, damaged20LCans, damaged1LBoxes, deliveryDate } = input
    let query = "insert into warehousestockdetails (warehouseId,20LCans,1LBoxes,500MLBoxes,250MLBoxes,damaged20LCans,damaged1LBoxes,damaged500MLBoxes,damaged250MLBoxes,deliveryDate,isConfirmed) values(?,?,?,?,?,?,?,?,?,?,?)";
    let requestBody = [departmentId, total20LCans, total1LBoxes, total500MLBoxes, total250MLBoxes, damaged20LCans, damaged1LBoxes, damaged500MLBoxes, damaged250MLBoxes, deliveryDate, '1']

    if (isDamaged) requestBody = [departmentId, total20LCans - damaged20LCans, total1LBoxes - damaged1LBoxes, total500MLBoxes - damaged500MLBoxes, total250MLBoxes - damaged250MLBoxes, damaged20LCans, damaged1LBoxes, damaged500MLBoxes, damaged250MLBoxes, deliveryDate, '1']
    executePostOrUpdateQuery(query, requestBody, callback)
}
warehouseQueries.insertReturnStockDetails = (input, callback) => {
    let query = "insert into returnstockdetails (damaged20LCans,damaged1LBoxes,damaged500MLBoxes,damaged250MLBoxes,damagedDesc,departmentId,motherplantId) values(?,?,?,?,?,?,?)";
    let requestBody = [input.damaged20LCans, input.damaged1LBoxes, input.damaged500MLBoxes, input.damaged250MLBoxes, input.damagedDesc, input.departmentId, input.motherplantId]
    executePostOrUpdateQuery(query, requestBody, callback)
}
warehouseQueries.returnEmptyCansToMotherplant = (input, callback) => {
    const { motherplantId, warehouseId, driverId, vehicleId, emptycans_count, details, isConfirmed = 0 } = input
    let query = "insert into EmptyCanDetails (motherplantId,warehouseId,driverId,vehicleId,emptycans_count,details,isConfirmed) values(?,?,?,?,?,?,?)";
    let requestBody = [motherplantId, warehouseId, driverId, vehicleId, emptycans_count, details, isConfirmed]
    executePostOrUpdateQuery(query, requestBody, callback)
}
warehouseQueries.updateMotherplantReturnEmptyCans = (input, callback) => {
    const { motherplantId, warehouseId, driverId, vehicleId, emptycans_count, details, isConfirmed = 0, id } = input
    let query = "update EmptyCanDetails set motherplantId=?, warehouseId=?, driverId=?, vehicleId=?, emptycans_count=?, details=?, isConfirmed=? where id=?";
    let requestBody = [motherplantId, warehouseId, driverId, vehicleId, emptycans_count, details, isConfirmed, id]
    executePostOrUpdateQuery(query, requestBody, callback)
}
warehouseQueries.createWarehouse = async (input, callback) => {
    const { address, departmentName, city, state, pinCode, adminId, phoneNumber } = input
    let query = "insert into departmentmaster (departmentName,departmentType,gstNo,gstProof,address,city,state,pinCode,adminId,phoneNumber) values(?,?,?,?,?,?,?,?,?,?)";
    let gstProof = input.gstProof && Buffer.from(input.gstProof.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let requestBody = [departmentName, 'Warehouse', input.gstNo, gstProof, address, city, state, pinCode, adminId, phoneNumber]
    return executePostOrUpdateQuery(query, requestBody, callback)
}
warehouseQueries.createRoute = async (input, callback) => {
    const { RouteName, RouteDescription, departmentId } = input
    let query = "insert into routes (RouteName, RouteDescription, departmentId) values(?,?,?)";
    let requestBody = [RouteName, RouteDescription, departmentId]
    return executePostOrUpdateQuery(query, requestBody, callback)
}

//Update Request Methods
warehouseQueries.confirmDispatchDetails = (input, callback) => {
    let query = "update dispatches set returnStockId=?,isConfirmed=?,status=? where DCNO=?";
    let requestBody = [input.returnStockId ? input.returnStockId : '0', 1, 'Delivered', input.dcNo];
    executePostOrUpdateQuery(query, requestBody, callback)
}
warehouseQueries.updateWarehouse = async (input, callback) => {
    const { address, departmentName, city, state, pinCode, adminId, phoneNumber, departmentId } = input
    let query = "update departmentmaster set departmentName=?,departmentType=?,gstNo=?,gstProof=?,address=?,city=?,state=?,pinCode=?,adminId=?,phoneNumber=? where departmentId=?";
    let gstProof = input.gstProof && Buffer.from(input.gstProof.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let requestBody = [departmentName, 'Warehouse', input.gstNo, gstProof, address, city, state, pinCode, adminId, phoneNumber, departmentId]
    return executePostOrUpdateQuery(query, requestBody, callback)
}

warehouseQueries.updateRoute = async (input, callback) => {
    const { RouteName, RouteDescription, departmentId, RouteId } = input
    let query = "update routes set RouteName=?, RouteDescription=?, departmentId=? where RouteId=?";
    let requestBody = [RouteName, RouteDescription, departmentId, RouteId]
    return executePostOrUpdateQuery(query, requestBody, callback)
}
warehouseQueries.updateDepartmentStatus = (input, callback) => {
    const { departmentId, status } = input
    let query = "update departmentmaster set isApproved=? where departmentId=?";
    let requestBody = [status, departmentId]
    executePostOrUpdateQuery(query, requestBody, callback)
}
warehouseQueries.deleteDepartment = (departmentId, callback) => {
    let query = "update departmentmaster set deleted=? where departmentId=?";
    let requestBody = [1, departmentId]
    executePostOrUpdateQuery(query, requestBody, callback)
}
warehouseQueries.deleteRoute = (RouteId, callback) => {
    let query = "update routes set deleted=? where RouteId=?";
    let requestBody = [1, RouteId]
    executePostOrUpdateQuery(query, requestBody, callback)
}
module.exports = warehouseQueries