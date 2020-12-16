const { executeGetQuery, executePostOrUpdateQuery } = require('../../utils/functions.js');
const GETDISPATCHQUERY = "SELECT d.DCNO,d.batchNo,d.product20L,d.product1L,d.product500ML,d.product250ML,d.driverName,d.dispatchTo,d.dispatchedDate,v.vehicleType,v.vehicleNo,m.departmentName from dispatches d INNER JOIN VehicleDetails v ON d.vehicleNo=v.vehicleId INNER JOIN departmentmaster m ON d.dispatchTo=m.departmentId ORDER BY d.dispatchedDate DESC";

const getProductionDetails = async (callback) => {
    let query = "select * from production";
    return executeGetQuery(query, callback)
}
const getBatchNumbers = async (callback) => {
    let query = "select batchNo from production";
    return executeGetQuery(query, callback)
}

const getVehicleDetails = async (callback) => {
    let query = "select * from VehicleDetails";
    return executeGetQuery(query, callback)
}
const getDispatchDetails = async (callback) => {
    return executeGetQuery(GETDISPATCHQUERY, callback)
}
const getAllQCDetails = async (callback) => {
    let query = "select * from qualitycontrol";
    return executeGetQuery(query, callback)
}

const getInternalQualityControl = async (callback) => {
    let query = "select * from internalqualitycontrol";
    return executeGetQuery(query, callback)
}
const getNatureOfBussiness = async (callback) => {
    let query = "SELECT SUBSTRING(COLUMN_TYPE,5) AS natureOfBussiness FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'customerorderdetails' AND COLUMN_NAME = 'isDelivered'";
    return executeGetQuery(query, callback)
}
const getRMDetails = async (callback) => {
    let query = "select * from requiredrawmaterial";
    return executeGetQuery(query, callback)
}
const getRMReceiptDetails = async (callback) => {
    let query = "select * from rawmaterialreceipt";
    return executeGetQuery(query, callback)
}
const getDepartmentsList = async (deptType, callback) => {
    let query = `select * from departmentmaster where departmentType="${deptType}"`
    return executeGetQuery(query, callback)
}




//POST Request Methods
const createQC = async (input, callback) => {
    let query = "insert into qualitycontrol (reportdate,batchNo,testType,reportImage,description) values(?,?,?,?,?)";
    let reportImage = Buffer.from(input.reportImage.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let requestBody = [input.reportdate, input.batchNo, input.testType, reportImage, input.description]
    return executePostOrUpdateQuery(query, requestBody, callback)
}
const createInternalQC = async (input, callback) => {
    let query = "insert into internalqualitycontrol (productionDate,batchNo,testType,description) values(?,?,?,?,?)";
    let requestBody = [input.productionDate, input.batchNo, input.testType, input.description]
    return executePostOrUpdateQuery(query, requestBody, callback)
}
const addProductionDetails = async (input, callback) => {
    let query = "insert into production (productionDate,phLevel,TDS,ozoneLevel,product20L, product1L, product500ML, product250ML,managerName,createdBy,shiftType) values(?,?,?,?,?,?,?,?,?,?,?)";
    let productionDate = new Date()
    let requestBody = [productionDate, input.phLevel, input.TDS, input.ozoneLevel, input.product20L, input.product1L, input.product500ML, input.product250ML, input.managerName, input.createdBy, input.shiftType]
    return executePostOrUpdateQuery(query, requestBody, callback)
}
const addVehicleDetails = async (input, callback) => {
    let query = "insert into VehicleDetails (vehicleNo,vehicleType) values(?,?)";
    let requestBody = [input.vehicleNo, input.vehicleType]
    return executePostOrUpdateQuery(query, requestBody, callback)
}
const addDispatchDetails = async (input, callback) => {
    let query = "insert into dispatches (vehicleNo,driverId,driverName,dispatchTo,batchNo,product20L,product1L,product500ML,product250ML) values(?,?,?,?,?,?,?,?,?)";
    let requestBody = [input.vehicleNo, input.driverId, input.driverName, input.dispatchTo, input.batchNo, input.product20L, input.product1L, input.product500ML, input.product250ML]
    return executePostOrUpdateQuery(query, requestBody, callback)
}
const createRM = async (input, callback) => {
    let query = "insert into requiredrawmaterial (itemName,description,recordLevel,minOrderLevel) values(?,?,?,?)";
    let requestBody = [input.itemName, input.description, input.recordLevel, input.minOrderLevel]
    return executePostOrUpdateQuery(query, requestBody, callback)
}
const createRMReceipt = async (input, callback) => {
    let query = "insert into rawmaterialreceipt (receiptdate,receivedFromParty,invoiceNo,itemreceived,price,qtyReceived,tax,invoiceValue,rawmaterialId,invoiceDate) values(?,?,?,?,?,?,?,?,?,?)";
    let requestBody = [input.receiptdate, input.receivedFromParty, input.invoiceNo, input.itemreceived, input.price, input.qtyReceived, input.tax, input.invoiceValue, input.rawmaterialId, input.invoiceDate]
    return executePostOrUpdateQuery(query, requestBody, callback)
}
const updateProductionDetails = async (input, callback) => {
    let query = "update production set batchNo=?,productionDate=?,phLevel=?,TDS=?,ozoneLevel=?,product20L=?,product1L=?,product500ML=?,product250ML=?,managerName=?,shiftType=? where productionid=" + input.productionid;
    let requestBody = [input.batchNo, input.productionDate, input.phLevel, input.TDS, input.ozoneLevel, input.product20L, input.product1L, input.product500ML, input.product250ML, input.managerName, input.shiftType]
    return executePostOrUpdateQuery(query, requestBody, callback)
}
const updateDispatchDetails = async (input, callback) => {
    let query = `update dispatches SET DCNO=?,vehicleNo=?,driverId=?,driverName=?,dispatchTo=?,batchNo=?,product20L=?,product1L=?,product500ML=?,product250ML=?,managerName=? where dispatchId="${input.dispatchId}"`;
    let requestBody = [input.DCNO, input.vehicleNo, input.driverId, input.driverName, input.dispatchTo, input.batchNo, input.product20L, input.product1L, input.product500ML, input.product250ML, input.managerName]
    return executePostOrUpdateQuery(query, requestBody, callback)
}
module.exports = {
    getProductionDetails, getVehicleDetails, getDispatchDetails, getAllQCDetails, createQC,
    getInternalQualityControl, createInternalQC, addProductionDetails, addVehicleDetails, getNatureOfBussiness,
    addDispatchDetails, createRM, createRMReceipt, getRMDetails, getRMReceiptDetails, updateProductionDetails,
    getBatchNumbers, updateDispatchDetails, getDepartmentsList
}