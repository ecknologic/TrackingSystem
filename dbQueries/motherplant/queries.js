const { executeGetQuery, executeGetParamsQuery, executePostOrUpdateQuery } = require('../../utils/functions.js');
const dayjs = require('dayjs');

var motherPlantDbQueries = {}
motherPlantDbQueries.getProductionDetails = async (departmentId, callback) => {
    let query = `select * from production WHERE departmentId=${departmentId} ORDER BY productionDate DESC`;
    return executeGetQuery(query, callback)
}
motherPlantDbQueries.getProductsByBatch = async (input, callback) => {
    let { departmentId, batchNo } = input
    let query = `SELECT SUM(p.product20L) AS product20LCount,SUM(p.product1L) AS product1LCount,SUM(p.product500ML) product500MLCount,SUM(p.product250ML) product250MLCount FROM production p WHERE departmentId=? AND batchId=?`;
    return executeGetParamsQuery(query, [departmentId, batchNo], callback)
}
motherPlantDbQueries.getDispatchesByBatch = async (input, callback) => {
    let { departmentId, batchNo } = input
    let query = `SELECT SUM(d.product20L) AS product20LCount,SUM(d.product1L) AS product1LCount,SUM(d.product500ML) product500MLCount,SUM(d.product250ML) product250MLCount FROM dispatches d WHERE departmentId=? AND batchId=?`;
    return executeGetParamsQuery(query, [departmentId, batchNo], callback)
}
motherPlantDbQueries.getBatchNumbers = async (departmentId, callback) => {
    let past10thDay = dayjs().subtract(10, 'day').format('YYYY-MM-DD')
    let query = "select batchId from production WHERE departmentId=? AND DATE(`productionDate`)>=? ORDER BY productionDate DESC";
    return executeGetParamsQuery(query, [departmentId, past10thDay], callback)
}

motherPlantDbQueries.getVehicleDetails = async (callback) => {
    let query = "select * from VehicleDetails";
    return executeGetQuery(query, callback)
}
motherPlantDbQueries.getDispatchDetails = async (departmentId, callback) => {
    let query = `SELECT d.dispatchType,d.dispatchAddress,d.DCNO,d.batchId,d.product20L,d.product1L,d.product500ML,d.product250ML,d.driverName,d.dispatchTo,d.dispatchedDate,v.vehicleType,v.vehicleNo from dispatches d INNER JOIN VehicleDetails v ON d.vehicleNo=v.vehicleId WHERE departmentId=${departmentId} ORDER BY d.dispatchedDate DESC`;
    return executeGetQuery(query, callback)
}
motherPlantDbQueries.getAllQCDetails = async (callback) => {
    let query = "select * from qualitycontrol";
    return executeGetQuery(query, callback)
}

motherPlantDbQueries.getProductionQcList = async (departmentId, callback) => {
    let query = `select * from productionQC where departmentId=${departmentId}`;
    return executeGetQuery(query, callback)
}
motherPlantDbQueries.getProductionQcBatchIds = async (departmentId, callback) => {
    let query = "select productionQcId,batchId from productionQC where departmentId=? AND status=?";
    return executeGetParamsQuery(query, [departmentId, "Pending"], callback)
}
motherPlantDbQueries.getQCDetailsByBatch = async (batchId, callback) => {
    let query = `select * from productionQC where batchId=?`;
    return executeGetParamsQuery(query, [batchId], callback)
}
motherPlantDbQueries.getInternalQualityControl = async (callback) => {
    let query = "select * from internalqualitycontrol";
    return executeGetQuery(query, callback)
}
motherPlantDbQueries.getNatureOfBussiness = async (callback) => {
    let query = "SELECT SUBSTRING(COLUMN_TYPE,5) AS natureOfBussiness FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'customerorderdetails' AND COLUMN_NAME = 'isDelivered'";
    return executeGetQuery(query, callback)
}
motherPlantDbQueries.getRMDetails = async (input, callback) => {
    let query = `select * from requiredrawmaterial WHERE departmentId=? ORDER BY requestedDate DESC`;
    if (input.status) query = `select * from requiredrawmaterial WHERE departmentId=? AND (status="Approved" or status="Confirmed") ORDER BY requestedDate DESC`
    return executeGetParamsQuery(query, [input.departmentId], callback)
}
motherPlantDbQueries.getRMReceiptDetails = async (departmentId, callback) => {
    let query = `select rmr.receiptDate,rmr.receiptNo,rmr.invoiceNo,rmr.taxAmount,rmr.invoiceAmount,rmr.rawmaterialId,rmr.invoiceDate,rmr.managerName,rmr.receiptImage,rm.itemName,rm.itemCode,rm.itemQty,rm.vendorName,rm.approvedDate,rm.description,rm.orderId from rawmaterialreceipt rmr INNER JOIN requiredrawmaterial rm on rmr.rawmaterialId=rm.rawmaterialid WHERE rmr.departmentId=${departmentId} ORDER BY receiptDate DESC`;
    // let query = `select * from rawmaterialreceipt WHERE departmentId=${departmentId}`;
    return executeGetQuery(query, callback)
}

motherPlantDbQueries.getReceiptDetailsByRMId = async (input, callback) => {
    let query = `select rmr.receiptDate,rmr.receiptNo,rmr.invoiceNo,rmr.taxAmount,rmr.invoiceAmount,rmr.rawmaterialId,rmr.invoiceDate,rmr.managerName,rmr.receiptImage,rm.itemName,rm.itemCode,rm.vendorName,rm.approvedDate,rm.description from rawmaterialreceipt rmr INNER JOIN requiredrawmaterial rm on rmr.rawmaterialId=rm.rawmaterialid WHERE rmr.departmentId=? AND rmr.rawmaterialId=?`;
    return executeGetParamsQuery(query, [input.departmentId, input.rmId], callback)
}

motherPlantDbQueries.getDepartmentsList = async (deptType, callback) => {
    let query = `select * from departmentmaster where departmentType="${deptType}"`
    return executeGetQuery(query, callback)
}
motherPlantDbQueries.getQCTestedBatches = async (departmentId, callback) => {
    let query = `select q.phLevel,q.TDS,q.ozoneLevel,q.managerName,q.testResult,q.testedDate,p.batchId,p.phLevel as ph,p.TDS as tds,p.ozoneLevel as oz,p.requestedDate from qualitycheck q INNER JOIN productionQC p on q.productionQcId=p.productionQcId  where q.departmentId="${departmentId}"`
    return executeGetQuery(query, callback)
}
motherPlantDbQueries.getCurrentProductionDetailsByDate = async (input, callback) => {
    let query = "SELECT SUM(p.product20L) AS total20LCans,SUM(p.product1L) AS total1LBoxes,SUM(p.product500ML) total500MLBoxes,SUM(p.product250ML) total250MLBoxes FROM production p WHERE departmentId=? AND DATE(`productionDate`)<=?";
    return executeGetParamsQuery(query, [input.departmentId, input.date], callback)
}
motherPlantDbQueries.getPDDetailsByDate = async (input, callback) => {
    let query = "SELECT SUM(d.product20L) AS total20LCans,SUM(d.product1L) AS total1LBoxes,SUM(d.product500ML) total500MLBoxes,SUM(d.product250ML) total250MLBoxes FROM dispatches d WHERE departmentId=? AND DATE(`dispatchedDate`)<=?";
    return executeGetParamsQuery(query, [input.departmentId, input.date], callback)
}
motherPlantDbQueries.getCurrentDispatchDetailsByDate = async (input, callback) => {
    let query = "SELECT JSON_ARRAYAGG(json_object('dcNo',d.DCNO,'isConfirmed',d.isConfirmed)) as DCDetails,SUM(d.product20L) AS total20LCans,SUM(d.product1L) AS total1LBoxes,SUM(d.product500ML) total500MLBoxes,SUM(d.product250ML) total250MLBoxes FROM dispatches d  WHERE dispatchTo=? AND DATE(`dispatchedDate`)=?";
    return executeGetParamsQuery(query, [input.departmentId, input.date], callback)
}
motherPlantDbQueries.getDispatchDetailsByDC = async (dcNo, callback) => {
    let query = `SELECT SUM(d.product20L) AS total20LCans,SUM(d.product1L) AS total1LBoxes,SUM(d.product500ML) total500MLBoxes,SUM(d.product250ML) total250MLBoxes,dcNo,GROUP_CONCAT(d.departmentId) as motherplantId,GROUP_CONCAT(v.vehicleType) vehicleType,GROUP_CONCAT(v.vehicleNo) vehicleNo,GROUP_CONCAT(driver.driverName) driverName,GROUP_CONCAT(driver.mobileNumber) mobileNumber,GROUP_CONCAT(dep.address) address
    FROM dispatches d INNER JOIN VehicleDetails v on d.vehicleNo=v.vehicleId INNER JOIN driverdetails driver on d.driverId=driver.driverId INNER JOIN departmentmaster dep on d.dispatchTo=dep.departmentId WHERE DCNO=?`;
    return executeGetParamsQuery(query, [dcNo], callback)
}

//POST Request Methods
motherPlantDbQueries.createQC = async (input, callback) => {
    let query = "insert into qualitycontrol (reportdate,batchId,testType,reportImage,description) values(?,?,?,?,?)";
    let reportImage = Buffer.from(input.reportImage.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let requestBody = [input.reportdate, input.batchId, input.testType, reportImage, input.description]
    return executePostOrUpdateQuery(query, requestBody, callback)
}
motherPlantDbQueries.createProductionQC = async (input, callback) => {
    const { phLevel, TDS, ozoneLevel, managerName, shiftType, departmentId } = input
    let query = "insert into productionQC (requestedDate,phLevel,TDS,ozoneLevel,managerName,shiftType,departmentId) values(?,?,?,?,?,?,?)";
    let requestBody = [new Date(), phLevel, TDS, ozoneLevel, managerName, shiftType, departmentId]
    return executePostOrUpdateQuery(query, requestBody, callback)
}
motherPlantDbQueries.createQualityCheck = async (input, callback) => {
    const { productionQcId, phLevel, TDS, ozoneLevel, testResult, managerName, description, testType, departmentId } = input
    let query = "insert into qualitycheck (testedDate,productionQcId,phLevel,TDS,ozoneLevel,testResult,managerName,description,testType,departmentId) values(?,?,?,?,?,?,?,?,?,?)";
    let requestBody = [new Date(), productionQcId, phLevel, TDS, ozoneLevel, testResult, managerName, description, testType, departmentId]
    motherPlantDbQueries.updateProductionQCStatus({ productionQcId, status: testResult })
    return executePostOrUpdateQuery(query, requestBody, callback)
}
motherPlantDbQueries.createInternalQC = async (input, callback) => {
    let query = "insert into internalqualitycontrol (productionDate,batchId,testType,description) values(?,?,?,?,?)";
    let requestBody = [input.productionDate, input.batchId, input.testType, input.description]
    return executePostOrUpdateQuery(query, requestBody, callback)
}
motherPlantDbQueries.addProductionDetails = async (input, callback) => {
    let query = "insert into production (productionDate,phLevel,TDS,ozoneLevel,product20L, product1L, product500ML, product250ML,managerName,createdBy,shiftType,departmentId,batchId) values(?,?,?,?,?,?,?,?,?,?,?,?,?)";
    let productionDate = new Date()
    let requestBody = [productionDate, input.phLevel, input.TDS, input.ozoneLevel, input.product20L, input.product1L, input.product500ML, input.product250ML, input.managerName, input.createdBy, input.shiftType, input.departmentId, input.batchId]
    return executePostOrUpdateQuery(query, requestBody, callback)
}
motherPlantDbQueries.addVehicleDetails = async (input, callback) => {
    let query = "insert into VehicleDetails (vehicleNo,vehicleType) values(?,?)";
    let requestBody = [input.vehicleNo, input.vehicleType]
    return executePostOrUpdateQuery(query, requestBody, callback)
}
motherPlantDbQueries.addDispatchDetails = async (input, callback) => {
    let query = "insert into dispatches (dispatchedDate,vehicleNo,driverId,driverName,dispatchTo,batchId,product20L,product1L,product500ML,product250ML,dispatchAddress, dispatchType,departmentId) values(?,?,?,?,?,?,?,?,?,?,?,?,?)";
    let requestBody = [input.dispatchedDate, input.vehicleNo, input.driverId, input.driverName, input.dispatchTo, input.batchId, input.product20L, input.product1L, input.product500ML, input.product250ML, input.dispatchAddress, input.dispatchType, input.departmentId]
    return executePostOrUpdateQuery(query, requestBody, callback)
}
motherPlantDbQueries.createRM = async (input, callback) => {
    let query = "insert into requiredrawmaterial (requestedDate,itemName,itemQty,description,reorderLevel,minOrderLevel,itemCode,vendorName,departmentId) values(?,?,?,?,?,?,?,?,?)";
    let requestBody = [input.requestedDate, input.itemName, input.itemQty, input.description, input.reorderLevel, input.minOrderLevel, input.itemCode, input.vendorName, input.departmentId]
    return executePostOrUpdateQuery(query, requestBody, callback)
}
motherPlantDbQueries.createRMReceipt = async (input, callback) => {
    let query = "insert into rawmaterialreceipt (receiptNo,invoiceNo,taxAmount,invoiceAmount,rawmaterialId,invoiceDate,departmentId,managerName,receiptImage) values(?,?,?,?,?,?,?,?,?)";
    const { receiptNo, invoiceNo, taxAmount, invoiceAmount, rawmaterialid, invoiceDate: date, departmentId, managerName } = input
    let invoiceDate = new Date(date)
    let receiptImage = Buffer.from(input.receiptImage.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let requestBody = [receiptNo, invoiceNo, taxAmount, invoiceAmount, rawmaterialid, invoiceDate, departmentId, managerName, receiptImage]
    return executePostOrUpdateQuery(query, requestBody, callback)
}

motherPlantDbQueries.updateProductionDetails = async (input, callback) => {
    let query = `update production set batchId=?,phLevel=?,TDS=?,ozoneLevel=?,product20L=?,product1L=?,product500ML=?,product250ML=?,managerName=?,shiftType=? where productionid=${input.productionid}`;
    let requestBody = [input.batchId, input.phLevel, input.TDS, input.ozoneLevel, input.product20L, input.product1L, input.product500ML, input.product250ML, input.managerName, input.shiftType]
    return executePostOrUpdateQuery(query, requestBody, (err, data) => {
        if (err) callback(err, data)
        else {
            let getQuery = `select * from production WHERE productionid=${input.productionid}`
            executeGetQuery(getQuery, callback)
        }
    })
}

motherPlantDbQueries.updateRMDetails = async (input, callback) => {
    let query = `update requiredrawmaterial set orderId=?,itemName=?,itemQty=?,description=?,reorderLevel=?,minOrderLevel=?,itemCode=?,vendorName=? where rawmaterialid=${input.rawmaterialid}`;
    let requestBody = [input.orderId, input.itemName, input.itemQty, input.description, input.reorderLevel, input.minOrderLevel, input.itemCode, input.vendorName]
    return executePostOrUpdateQuery(query, requestBody, callback)
}

motherPlantDbQueries.updateRMStatus = async (input, callback) => {
    let query = `update requiredrawmaterial set status=? where rawmaterialid=${input.rawmaterialid}`;
    let requestBody = [input.status]
    return executePostOrUpdateQuery(query, requestBody, callback)
}

motherPlantDbQueries.updateDispatchDetails = async (input, callback) => {
    let query = `update dispatches SET DCNO=?,vehicleNo=?,driverId=?,driverName=?,dispatchTo=?,batchId=?,product20L=?,product1L=?,product500ML=?,product250ML=?,managerName=?,dispatchAddress=? where dispatchId="${input.dispatchId}"`;
    let requestBody = [input.DCNO, input.vehicleNo, input.driverId, input.driverName, input.dispatchTo, input.batchId, input.product20L, input.product1L, input.product500ML, input.product250ML, input.managerName, input.dispatchAddress]
    executePostOrUpdateQuery(query, requestBody, (err, data) => {
        if (err) callback(err, data)
        else {
            let getQuery = `SELECT d.dispatchAddress,d.dispatchType,d.DCNO,d.batchId,d.product20L,d.product1L,d.product500ML,d.product250ML,d.driverName,d.dispatchTo,d.dispatchedDate,v.vehicleType,v.vehicleNo from dispatches d INNER JOIN VehicleDetails v ON d.vehicleNo=v.vehicleId WHERE dispatchId=${input.dispatchId}`
            executeGetQuery(getQuery, callback)
        }
    })
}
motherPlantDbQueries.updateProductionQC = (input, callback) => {
    const { batchId, phLevel, TDS, ozoneLevel, managerName, shiftType, productionQcId } = input
    let query = `update productionQC set batchId=?,phLevel=?,TDS=?,ozoneLevel=?,managerName=?,shiftType=? where productionQcId=${productionQcId}`;
    let requestBody = [batchId, phLevel, TDS, ozoneLevel, managerName, shiftType]
    return executePostOrUpdateQuery(query, requestBody, callback)
}
motherPlantDbQueries.updateProductionQCStatus = (input, callback) => {
    let query = `update productionQC set status=? where productionQcId=${input.productionQcId}`;
    let requestBody = [input.status]
    return executePostOrUpdateQuery(query, requestBody, callback)
}
module.exports = motherPlantDbQueries