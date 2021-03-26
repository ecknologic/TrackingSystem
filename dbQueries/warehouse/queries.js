const { executeGetQuery, executeGetParamsQuery, executePostOrUpdateQuery, dateComparisions } = require('../../utils/functions.js');
let warehouseQueries = {}

warehouseQueries.getWarehouseList = async (callback) => {
    let query = `select d.departmentId,d.departmentName,d.address,d.state,d.city,d.isApproved,u.userName as adminName,u.emailid as adminEmail,u.mobileNumber as adminNumber from departmentmaster d INNER JOIN usermaster u on d.adminId=u.userId WHERE d.departmentType='Warehouse' AND d.deleted='0' ORDER BY d.createdDateTime DESC`;
    return executeGetQuery(query, callback)
}
warehouseQueries.getDCList = async (departmentId, callback) => {
    let query = `select co.dcNo, co.customerName,co.address,c.Address1 as deliveryAddress,c.gstNo,c.EmailId,c.panNo,c.customerId,c.createdBy FROM customerorderdetails co LEFT JOIN customerdetails c ON co.existingCustomerId=c.customerId WHERE warehouseId=? AND co.creationType='manual'`;
    return executeGetParamsQuery(query, [departmentId], callback)
}
warehouseQueries.getDeliveryDetails = (input, callback) => {
    const { date, departmentId } = input
    let query = "select c.customerOrderId,c.existingCustomerId,c.creationType,c.customerType,c.customerName,c.phoneNumber,c.address,c.routeId,c.driverId,c.isDelivered,c.dcNo,c.20LCans AS product20L,c.1LBoxes AS product1L,c.500MLBoxes AS product500ML,c.300MLBoxes AS product300ML,c.2LBoxes AS product2L,r.*,d.driverName,d.mobileNumber FROM customerorderdetails c LEFT JOIN routes r  ON c.routeId=r.routeid left JOIN driverdetails d ON c.driverId=d.driverid  WHERE DATE(`deliveryDate`) = ? AND warehouseId=? ORDER BY c.dcNo DESC";
    return executeGetParamsQuery(query, [date, departmentId], callback)
}
warehouseQueries.getTotalReturnCans = (input, callback) => {
    const { departmentId, date } = input
    let query = 'SELECT SUM(returnEmptyCans) AS emptycans FROM customerorderdetails WHERE DATE(deliveredDate)=? AND warehouseId=?'
    return executeGetParamsQuery(query, [date, departmentId], callback)
}

warehouseQueries.getAllDcDetails = (input, callback) => {
    const { fromDate, toDate, departmentId, customerIds } = input
    let query = "select c.returnEmptyCans,c.customerOrderId,c.deliveredDate,c.customerName,c.phoneNumber,c.address,c.routeId,c.driverId,c.isDelivered,c.dcNo,c.20LCans AS product20L,c.1LBoxes AS product1L,c.500MLBoxes AS product500ML,c.300MLBoxes AS product300ML,c.2LBoxes AS product2L,r.*,d.driverName,d.mobileNumber FROM customerorderdetails c INNER JOIN routes r  ON c.routeId=r.routeid left JOIN driverdetails d ON c.driverId=d.driverid  WHERE warehouseId=? AND isDelivered='Completed' ORDER BY c.dcNo DESC";
    let options = [departmentId]
    if (customerIds && fromDate && toDate && departmentId) {
        query = "select c.returnEmptyCans,c.customerOrderId,c.deliveredDate,c.customerName,c.phoneNumber,c.address,c.routeId,c.driverId,c.isDelivered,c.dcNo,c.20LCans AS product20L,c.1LBoxes AS product1L,c.500MLBoxes AS product500ML,c.300MLBoxes AS product300ML,c.2LBoxes AS product2L,r.*,d.driverName,d.mobileNumber FROM customerorderdetails c INNER JOIN routes r  ON c.routeId=r.routeid left JOIN driverdetails d ON c.driverId=d.driverid  WHERE existingCustomerId IN (?) AND (DATE(deliveryDate) BETWEEN ? AND ?) AND warehouseId=? AND isDelivered='Completed' ORDER BY c.dcNo DESC";
        options = [customerIds, fromDate, toDate, departmentId]
    } else if (customerIds && fromDate && toDate && !departmentId) {
        query = "select c.returnEmptyCans,c.customerOrderId,c.deliveredDate,c.customerName,c.phoneNumber,c.address,c.routeId,c.driverId,c.isDelivered,c.dcNo,c.20LCans AS product20L,c.1LBoxes AS product1L,c.500MLBoxes AS product500ML,c.300MLBoxes AS product300ML,c.2LBoxes AS product2L,r.*,d.driverName,d.mobileNumber FROM customerorderdetails c INNER JOIN routes r  ON c.routeId=r.routeid left JOIN driverdetails d ON c.driverId=d.driverid  WHERE existingCustomerId IN (?) AND (DATE(deliveryDate) BETWEEN ? AND ?) AND isDelivered='Completed' ORDER BY c.dcNo DESC";
        options = [customerIds, fromDate, toDate]
    }
    else if (customerIds) {
        query = "select c.returnEmptyCans,c.customerOrderId,c.deliveredDate,c.customerName,c.phoneNumber,c.address,c.routeId,c.driverId,c.isDelivered,c.dcNo,c.20LCans AS product20L,c.1LBoxes AS product1L,c.500MLBoxes AS product500ML,c.300MLBoxes AS product300ML,c.2LBoxes AS product2L,r.*,d.driverName,d.mobileNumber FROM customerorderdetails c INNER JOIN routes r  ON c.routeId=r.routeid left JOIN driverdetails d ON c.driverId=d.driverid  WHERE existingCustomerId IN (?) AND warehouseId=? AND isDelivered='Completed' ORDER BY c.dcNo DESC";
        options = [customerIds, departmentId]
    }
    return executeGetParamsQuery(query, options, callback)
}

warehouseQueries.getCustomerDcDetails = (customerId, callback) => {
    let query = "select c.customerOrderId,c.customerName,c.phoneNumber,c.address,c.routeId,c.driverId,c.isDelivered,c.dcNo,c.20LCans AS product20L,c.1LBoxes AS product1L,c.500MLBoxes AS product500ML,c.300MLBoxes AS product300ML,c.2LBoxes AS product2L,c.deliveredDate,r.*,d.driverName,d.mobileNumber FROM customerorderdetails c INNER JOIN routes r  ON c.routeId=r.routeid left JOIN driverdetails d ON c.driverId=d.driverid  WHERE existingCustomerId=? AND isDelivered='Completed' ORDER BY c.dcNo DESC";
    return executeGetParamsQuery(query, [customerId], callback)
}
warehouseQueries.getDcDetailsByDcNo = (dcNo, callback) => {
    let query = "select dcNo, 20LCans AS product20L,1LBoxes AS product1L,500MLBoxes AS product500ML,300MLBoxes AS product300ML,2LBoxes AS product2L FROM customerorderdetails  WHERE dcNo=?";
    return executeGetParamsQuery(query, [dcNo], callback)
}
warehouseQueries.getTotalSales = (input, callback) => {
    const { startDate, endDate, departmentId, fromStart } = input
    let query = "select SUM(c.20LCans) AS product20LCount,SUM(c.1LBoxes) AS product1LCount,SUM(c.500MLBoxes) AS product500MLCount,SUM(c.300MLBoxes) AS product300MLCount,SUM(c.2LBoxes) AS product2LCount,c.deliveredDate FROM customerorderdetails c WHERE DATE(`deliveredDate`) <= ? AND isDelivered='Completed'";
    let options = [endDate]

    if (fromStart !== 'true') {
        query = "select SUM(c.20LCans) AS product20LCount,SUM(c.1LBoxes) AS product1LCount,SUM(c.500MLBoxes) AS product500MLCount,SUM(c.300MLBoxes) AS product300MLCount,SUM(c.2LBoxes) AS product2LCount,c.deliveredDate FROM customerorderdetails c WHERE DATE(`deliveredDate`) >= ? AND DATE(`deliveredDate`) <= ? AND isDelivered='Completed'";
        options = [startDate, endDate]
    }

    if (departmentId != 'All') {
        query = "select SUM(c.20LCans) AS product20LCount,SUM(c.1LBoxes) AS product1LCount,SUM(c.500MLBoxes) AS product500MLCount,SUM(c.300MLBoxes) AS product300MLCount,SUM(c.2LBoxes) AS product2LCount,c.deliveredDate FROM customerorderdetails c WHERE  DATE(`deliveredDate`) <= ? AND warehouseId=? AND isDelivered='Completed'";
        options = [endDate, departmentId]

        if (fromStart !== 'true') {
            query = "select SUM(c.20LCans) AS product20LCount,SUM(c.1LBoxes) AS product1LCount,SUM(c.500MLBoxes) AS product500MLCount,SUM(c.300MLBoxes) AS product300MLCount,SUM(c.2LBoxes) AS product2LCount,c.deliveredDate FROM customerorderdetails c WHERE DATE(`deliveredDate`) >= ? AND DATE(`deliveredDate`) <= ? AND warehouseId=? AND isDelivered='Completed'";
            options = [startDate, endDate, departmentId]
        }
    }
    return executeGetParamsQuery(query, options, callback)
}
warehouseQueries.getTotalCurrentActiveStocks = (input, callback) => {
    const { startDate, endDate, departmentId, fromStart } = input
    let query = "SELECT (`a`.`total20LCans` - IFNULL(`b`.`total20LCans`,0)) AS `total20LCans`, (`a`.`total1LBoxes` - IFNULL(`b`.`total1LBoxes`,0)) AS `total1LBoxes`, (`a`.`total500MLBoxes` - IFNULL(`b`.`total500MLBoxes`,0)) AS `total500MLBoxes`, (`a`.`total300MLBoxes` - IFNULL(`b`.`total300MLBoxes`,0)) AS `total300MLBoxes`,(`a`.`total2LBoxes` - IFNULL(`b`.`total2LBoxes`,0)) AS `total2LBoxes` FROM (SELECT  SUM(20LCans) AS `total20LCans`,SUM(1LBoxes) AS `total1LBoxes`, SUM(500MLBoxes) AS `total500MLBoxes`,SUM(300MLBoxes) AS `total300MLBoxes`,SUM(2LBoxes) AS `total2LBoxes` FROM `warehousestockdetails` WHERE warehouseId=? AND DATE(DeliveryDate)<=?) AS a INNER JOIN (SELECT  SUM(20LCans) AS `total20LCans`, SUM(1LBoxes) AS `total1LBoxes`,  SUM(500MLBoxes) AS `total500MLBoxes`, SUM(300MLBoxes) AS `total300MLBoxes`, SUM(2LBoxes) AS `total2LBoxes`  FROM  customerorderdetails WHERE  isDelivered='Completed' AND warehouseId=? AND DATE(DeliveryDate)<=?) AS b";
    let options = [departmentId, endDate, departmentId, endDate]

    if (fromStart !== 'true') {
        query = "SELECT (`a`.`total20LCans` - IFNULL(`b`.`total20LCans`,0)) AS `total20LCans`, (`a`.`total1LBoxes` - IFNULL(`b`.`total1LBoxes`,0)) AS `total1LBoxes`, (`a`.`total500MLBoxes` - IFNULL(`b`.`total500MLBoxes`,0)) AS `total500MLBoxes`, (`a`.`total300MLBoxes` - IFNULL(`b`.`total300MLBoxes`,0)) AS `total300MLBoxes`,(`a`.`total2LBoxes` - IFNULL(`b`.`total2LBoxes`,0)) AS `total2LBoxes` FROM (SELECT  SUM(20LCans) AS `total20LCans`,SUM(1LBoxes) AS `total1LBoxes`, SUM(500MLBoxes) AS `total500MLBoxes`,SUM(300MLBoxes) AS `total300MLBoxes`,SUM(2LBoxes) AS `total2LBoxes` FROM `warehousestockdetails` WHERE warehouseId=? AND DeliveryDate BETWEEN ? AND ?) AS a INNER JOIN (SELECT  SUM(20LCans) AS `total20LCans`, SUM(1LBoxes) AS `total1LBoxes`,  SUM(500MLBoxes) AS `total500MLBoxes`, SUM(300MLBoxes) AS `total300MLBoxes`, SUM(2LBoxes) AS `total2LBoxes`  FROM  customerorderdetails WHERE  isDelivered='Completed' AND warehouseId=? AND DeliveryDate BETWEEN ? AND ?) AS b";
        options = [departmentId, startDate, endDate, departmentId, startDate, endDate]
    }

    return executeGetParamsQuery(query, options, callback)
}
warehouseQueries.getTotalSalesChange = (input, callback) => {
    const { startDate, endDate, departmentId, type } = input
    const { startDate: newStartDate, endDate: newEndDate } = dateComparisions(startDate, endDate, type)
    let query = "select SUM(c.20LCans) AS product20LCount,SUM(c.1LBoxes) AS product1LCount,SUM(c.500MLBoxes) AS product500MLCount,SUM(c.300MLBoxes) AS product300MLCount,SUM(c.2LBoxes) AS product2LCount FROM customerorderdetails c WHERE DATE(`deliveredDate`) >= ? AND DATE(`deliveredDate`) <= ? AND isDelivered='Completed'";
    let options = [newStartDate, newEndDate]
    if (departmentId != 'All') {
        query = "select SUM(c.20LCans) AS product20LCount,SUM(c.1LBoxes) AS product1LCount,SUM(c.500MLBoxes) AS product500MLCount,SUM(c.300MLBoxes) AS product300MLCount,SUM(c.2LBoxes) AS product2LCount FROM customerorderdetails c WHERE DATE(`deliveredDate`) >= ? AND DATE(`deliveredDate`) <= ? AND warehouseId=? AND isDelivered='Completed'";
        options = [newStartDate, newEndDate, departmentId]
    }
    return executeGetParamsQuery(query, options, callback)
}
warehouseQueries.getDeliverysByCustomerOrderId = (customerOrderId, callback) => {
    let query = "select c.customerOrderId,c.existingCustomerId,c.customerType,c.customerName,c.phoneNumber,c.address,c.routeId,c.driverId,c.isDelivered,c.dcNo,c.20LCans AS product20L,c.1LBoxes AS product1L,c.500MLBoxes AS product50M0L,c.300MLBoxes AS product300ML,c.2LBoxes AS product2L,r.*,d.driverName,d.mobileNumber FROM customerorderdetails c LEFT JOIN routes r  ON c.routeId=r.routeid left JOIN driverdetails d ON c.driverId=d.driverid  WHERE customerOrderId=" + customerOrderId;
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
warehouseQueries.getReturnedEmptyCans = async (warehouseId, date, callback) => {
    // let query = "SELECT (SELECT SUM(c.returnemptycans) FROM customerorderdetails c WHERE c.warehouseid=?)-(SELECT SUM(e.emptycans_count)  FROM EmptyCanDetails e  WHERE e.isconfirmed=1 AND e.warehouseId=?) AS emptycans";
    let query = `SELECT ABS(e.emptycans) AS emptycans FROM (SELECT (SELECT IFNULL(SUM(c.returnemptycans),0) FROM customerorderdetails c WHERE c.warehouseid=?)-(SELECT IFNULL(SUM(e.emptycans_count),0)
    FROM EmptyCanDetails e  WHERE e.status='Pending' AND e.warehouseId=?) AS emptycans) AS e`
    return executeGetParamsQuery(query, [warehouseId, warehouseId], callback)
}
warehouseQueries.getConfirmedEmptyCans = async (warehouseId, date, callback) => {
    // let query = "SELECT (SELECT SUM(c.returnemptycans) FROM customerorderdetails c WHERE c.warehouseid=?)-(SELECT SUM(e.emptycans_count)  FROM EmptyCanDetails e  WHERE e.isconfirmed=1 AND e.warehouseId=?) AS emptycans";
    let query = `SELECT ABS(e.emptycans) AS emptycans FROM (SELECT (SELECT IFNULL(SUM(c.returnemptycans),0) FROM customerorderdetails c WHERE c.warehouseid=?)-(SELECT IFNULL(SUM(e.emptycans_count),0)
    FROM EmptyCanDetails e  WHERE e.status='Approved' AND e.warehouseId=?) AS emptycans) AS e`
    return executeGetParamsQuery(query, [warehouseId, warehouseId], callback)
}
warehouseQueries.getEmptyCansList = async (departmentId, callback) => {
    let query = "SELECT e.*,d.departmentName,dri.driverName,dri.mobileNumber,v.vehicleType,v.vehicleName,v.vehicleNo from EmptyCanDetails e INNER JOIN departmentmaster d ON e.motherplantId=d.departmentId INNER JOIN driverdetails dri ON e.driverId=dri.driverId INNER JOIN VehicleDetails v ON e.vehicleId=v.vehicleId where e.warehouseId=? OR e.motherPlantId=? ORDER BY e.createdDateTime DESC";
    return executeGetParamsQuery(query, [departmentId, departmentId], callback)
}
warehouseQueries.getTotalEmptyCansCount = async (input, callback) => {
    let { departmentId, startDate, endDate, fromStart } = input;
    let options = [departmentId, departmentId, endDate]
    let query = "SELECT SUM(emptycans_count) as product20LCount from EmptyCanDetails where warehouseId=? OR motherPlantId=? AND DATE(approvedDate)<=?";
    if (fromStart !== 'true') {
        options = [departmentId, departmentId, startDate, endDate]
        query = "SELECT SUM(emptycans_count) as product20LCount from EmptyCanDetails where warehouseId=? OR motherPlantId=? AND DATE(approvedDate)>=?  AND DATE(approvedDate)<=?";
    }
    return executeGetParamsQuery(query, options, callback)
}
warehouseQueries.getTotalEmptyCansChangeCount = async (input, callback) => {
    let { departmentId, startDate, endDate, fromStart, type } = input;
    const { startDate: newStartDate, endDate: newEndDate } = dateComparisions(startDate, endDate, type)
    let options = [departmentId, departmentId, newEndDate]
    let query = "SELECT SUM(emptycans_count) as product20LCount from EmptyCanDetails where warehouseId=? OR motherPlantId=? AND DATE(approvedDate)<=?";
    if (fromStart !== 'true') {
        options = [departmentId, departmentId, newStartDate, newEndDate]
        query = "SELECT SUM(emptycans_count) as product20LCount from EmptyCanDetails where warehouseId=? OR motherPlantId=? AND DATE(approvedDate)>=?  AND DATE(approvedDate)<=?";
    }
    return executeGetParamsQuery(query, options, callback)
}
warehouseQueries.getReceivedStock = async (warehouseId, callback) => {
    let query = "SELECT w.id,w.DCNO as dcNo,w.warehouseId,w.isConfirmed,w.deliveryDate,w.20LCans as product20L,w.1LBoxes as product1L,w.500MLBoxes as product500ML,w.300MLBoxes as product300ML,w.2LBoxes as product2L,d.driverName,dri.mobileNumber,dep.address,dep.departmentName,dep.departmentId from warehousestockdetails w INNER JOIN dispatches d ON w.DCNO=d.DCNO INNER JOIN departmentmaster dep ON d.departmentId=dep.departmentId INNER JOIN driverdetails dri ON d.driverId=dri.driverId where w.warehouseId=? ORDER BY w.deliveryDate DESC";
    return executeGetParamsQuery(query, [warehouseId], callback)
}
warehouseQueries.getReceivedStockById = async (input, callback) => {
    const { id } = input
    let query = "SELECT w.id,w.DCNO as dcNo,w.warehouseId,w.isConfirmed,w.deliveryDate,w.damaged20LCans,w.damaged1LBoxes,w.damaged500MLBoxes,w.damaged300MLBoxes,w.damaged2LBoxes,(w.20LCans+w.damaged20LCans) as product20L,(w.1LBoxes+w.damaged1LBoxes) as product1L,(w.500MLBoxes+w.damaged500MLBoxes) as product500ML,(w.300MLBoxes+w.damaged300MLBoxes) as product300ML,(w.2LBoxes+w.damaged2LBoxes) as product2L,d.driverName,dri.mobileNumber,dep.address,dep.departmentName,v.vehicleType,v.vehicleName,v.vehicleNo from warehousestockdetails w INNER JOIN dispatches d ON w.DCNO=d.DCNO INNER JOIN departmentmaster dep ON d.departmentId=dep.departmentId INNER JOIN driverdetails dri ON d.driverId=dri.driverId INNER JOIN VehicleDetails v ON d.vehicleNo=v.vehicleId where w.id=?";
    return executeGetParamsQuery(query, [id], callback)
}
warehouseQueries.getDepartmentStaff = async (warehouseId, callback) => {
    let query = "SELECT d.driverId,d.driverName as userName,d.isActive,d.emailid,d.address,d.mobileNumber,dep.departmentName from driverdetails d INNER JOIN departmentmaster dep on d.departmentId=dep.departmentId where d.departmentId=? AND d.deleted='0' ORDER BY d.createdDateTime DESC";
    return executeGetParamsQuery(query, [warehouseId], callback)
}
//POST Request Methods
warehouseQueries.saveWarehouseStockDetails = (input, callback) => {
    const { isDamaged, departmentId, product20L, product1L, product300ML, product2L, product500ML, damaged500MLBoxes, damaged300MLBoxes, damaged2LBoxes, damaged20LCans, damaged1LBoxes, deliveryDate, dcNo, damagedDesc } = input
    let query = "insert into warehousestockdetails (warehouseId,20LCans,1LBoxes,500MLBoxes,300MLBoxes,2LBoxes,damaged20LCans,damaged1LBoxes,damaged500MLBoxes,damaged300MLBoxes,damaged2LBoxes,deliveryDate,isConfirmed,DCNO,damagedDesc) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    let requestBody = [departmentId, product20L, product1L, product500ML, product300ML, product2L, damaged20LCans, damaged1LBoxes, damaged500MLBoxes, damaged300MLBoxes, damaged2LBoxes, deliveryDate, '1', dcNo, damagedDesc]

    if (isDamaged) requestBody = [departmentId, product20L - damaged20LCans, product1L - damaged1LBoxes, product500ML - damaged500MLBoxes, product300ML - damaged300MLBoxes, product2L - damaged2LBoxes, damaged20LCans, damaged1LBoxes, damaged500MLBoxes, damaged300MLBoxes, damaged2LBoxes, deliveryDate, '1', dcNo, damagedDesc]
    executePostOrUpdateQuery(query, requestBody, callback)
}
warehouseQueries.insertReturnStockDetails = (input, callback) => {
    let query = "insert into returnstockdetails (damaged20LCans,damaged1LBoxes,damaged500MLBoxes,damaged300MLBoxes,damaged2LBoxes,damagedDesc,departmentId,motherplantId) values(?,?,?,?,?,?,?,?)";
    let requestBody = [input.damaged20LCans, input.damaged1LBoxes, input.damaged500MLBoxes, input.damaged300MLBoxes, input.damaged2LBoxes, input.damagedDesc, input.departmentId, input.motherplantId]
    executePostOrUpdateQuery(query, requestBody, callback)
}
warehouseQueries.returnEmptyCansToMotherplant = (input, callback) => {
    const { motherplantId, warehouseId, driverId, vehicleId, emptycans_count, details, status = 'Pending' } = input
    let query = "insert into EmptyCanDetails (motherplantId,warehouseId,driverId,vehicleId,emptycans_count,details,status,createdDateTime) values(?,?,?,?,?,?,?,?)";
    let requestBody = [motherplantId, warehouseId, driverId, vehicleId, emptycans_count, details, status, new Date()]
    executePostOrUpdateQuery(query, requestBody, callback)
}
warehouseQueries.updateMotherplantReturnEmptyCans = (input, callback) => {
    const { motherplantId, warehouseId, driverId, vehicleId, emptycans_count, details, status = 'Pending', id } = input
    let query = "update EmptyCanDetails set motherplantId=?, warehouseId=?, driverId=?, vehicleId=?, emptycans_count=?, details=?, status=? where id=?";
    let requestBody = [motherplantId, warehouseId, driverId, vehicleId, emptycans_count, details, status, id]
    executePostOrUpdateQuery(query, requestBody, () => {
        let query1 = `SELECT e.*,d.departmentName,dri.driverName,dri.mobileNumber from EmptyCanDetails e INNER JOIN departmentmaster d ON e.motherplantId=d.departmentId INNER JOIN driverdetails dri ON e.driverId=dri.driverId where id=${id}`
        executeGetQuery(query1, callback)
    })
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