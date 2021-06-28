const { executeGetQuery, executeGetParamsQuery, executePostOrUpdateQuery, dateComparisions } = require('../../utils/functions.js');
const dayjs = require('dayjs');

var motherPlantDbQueries = {}
motherPlantDbQueries.getMotherPlantsList = async (callback) => {
    let query = `select d.departmentId, d.departmentName,d.address,d.state,d.city,d.isApproved,u.userName as adminName,u.emailid as adminEmail, u.mobileNumber as adminNumber from departmentmaster d INNER JOIN usermaster u on d.adminId=u.userId WHERE d.departmentType='MotherPlant' AND d.deleted='0' ORDER BY d.createdDateTime DESC`;
    return executeGetQuery(query, callback)
}
motherPlantDbQueries.getMotherPlantById = async (motherPlantId, callback) => {
    let query = `select d.*,u.userName,u.mobileNumber,u.emailid,u.RoleId as roleId from departmentmaster d INNER JOIN usermaster u on d.adminId=u.userId WHERE d.departmentId=${motherPlantId}`;
    return executeGetQuery(query, callback)
}
motherPlantDbQueries.getDepartmentDetailsById = async (departmentId, callback) => {
    let query = `select address, departmentName, city, state, pinCode, adminId, phoneNumber,gstNo from departmentmaster  WHERE departmentId=${departmentId}`;
    return executeGetQuery(query, callback)
}
motherPlantDbQueries.getProductionDetails = async (departmentId, callback) => {
    let query = `select * from production WHERE departmentId=${departmentId} ORDER BY productionDate DESC`;
    return executeGetQuery(query, callback)
}
motherPlantDbQueries.getProductsByBatch = async (input, callback) => {
    let { departmentId, batchNo } = input
    let query = `SELECT SUM(p.product20L) AS product20LCount,SUM(p.product1L) AS product1LCount,SUM(p.product500ML) product500MLCount,SUM(p.product300ML) product300MLCount,SUM(p.product2L) product2LCount FROM production p WHERE departmentId=? AND batchId=?`;
    return executeGetParamsQuery(query, [departmentId, batchNo], callback)
}
motherPlantDbQueries.getTotalProduction = async (input, callback) => {
    let { departmentId, startDate, endDate, fromStart, type } = input
    let query = `SELECT SUM(p.product20L) AS product20LCount,SUM(p.product1L) AS product1LCount,SUM(p.product500ML) product500MLCount,SUM(p.product300ML) product300MLCount,SUM(p.product2L) product2LCount FROM production p WHERE DATE(productionDate)<=? AND isApproved=1`;
    let options = [endDate]

    if (fromStart !== 'true') {
        query = `SELECT SUM(p.product20L) AS product20LCount,SUM(p.product1L) AS product1LCount,SUM(p.product500ML) product500MLCount,SUM(p.product300ML) product300MLCount,SUM(p.product2L) product2LCount FROM production p WHERE DATE(productionDate)>=? AND DATE(productionDate)<=? AND isApproved=1`;
        options = [startDate, endDate]
    }

    if (departmentId != 'All') {
        query = `SELECT SUM(p.product20L) AS product20LCount,SUM(p.product1L) AS product1LCount,SUM(p.product500ML) product500MLCount,SUM(p.product300ML) product300MLCount,SUM(p.product2L) product2LCount FROM production p WHERE departmentId=? AND DATE(productionDate)<=? AND isApproved=1`;
        options = [departmentId, endDate]

        if (fromStart !== 'true') {
            query = `SELECT SUM(p.product20L) AS product20LCount,SUM(p.product1L) AS product1LCount,SUM(p.product500ML) product500MLCount,SUM(p.product300ML) product300MLCount,SUM(p.product2L) product2LCount FROM production p WHERE departmentId=? AND DATE(productionDate)>=? AND DATE(productionDate)<=? AND isApproved=1`;
            options = [departmentId, startDate, endDate]
        }
    }
    if (type == "This Week") query = query.concat(" GROUP BY productionDate")
    return executeGetParamsQuery(query, options, callback)
}
motherPlantDbQueries.getTotalChangeProduction = async (input, callback) => {
    let { departmentId, startDate, endDate, type } = input
    const { startDate: newStartDate, endDate: newEndDate } = dateComparisions(startDate, endDate, type)
    let query = `SELECT SUM(p.product20L) AS product20LCount,SUM(p.product1L) AS product1LCount,SUM(p.product500ML) product500MLCount,SUM(p.product300ML) product300MLCount,,SUM(p.product2L) product2LCount FROM production p WHERE DATE(productionDate)>=? AND DATE(productionDate)<=?`;
    let options = [newStartDate, newEndDate]
    if (departmentId != 'All') {
        query = `SELECT SUM(p.product20L) AS product20LCount,SUM(p.product1L) AS product1LCount,SUM(p.product500ML) product500MLCount,SUM(p.product300ML) product300MLCount,,SUM(p.product2L) product2LCount FROM production p WHERE departmentId=? AND DATE(productionDate)>=? AND DATE(productionDate)<=?`;
        options = [departmentId, newStartDate, newEndDate]
    }
    return executeGetParamsQuery(query, options, callback)
}
motherPlantDbQueries.getDispatchesByBatch = async (input, callback) => {
    let { departmentId, batchNo } = input
    let query = `SELECT SUM(d.product20L) AS product20LCount,SUM(d.product1L) AS product1LCount,SUM(d.product500ML) product500MLCount,SUM(d.product300ML) product300MLCount,SUM(d.product2L) product2LCount FROM dispatches d WHERE departmentId=? AND batchId=?`;
    return executeGetParamsQuery(query, [departmentId, batchNo], callback)
}
motherPlantDbQueries.getProducedBatchNumbers = async (departmentId, callback) => {
    let past10thDay = dayjs().subtract(10, 'day').format('YYYY-MM-DD')
    let query = "select p.batchId,q.productionQcId from production p INNER JOIN productionQC q on p.batchId=q.batchId WHERE p.departmentId=? AND q.outOfStock='0' AND q.departmentId=? AND DATE(`productionDate`)>=? ORDER BY productionDate DESC";
    return executeGetParamsQuery(query, [departmentId, departmentId, past10thDay], callback)
}

motherPlantDbQueries.getVehicleDetails = async (callback) => {
    let query = "select * from VehicleDetails WHERE deleted='0' ORDER BY createdDateTime DESC";
    return executeGetQuery(query, callback)
}
motherPlantDbQueries.getDispatchDetails = async (departmentId, callback) => {
    let query = `SELECT d.status,d.dispatchType,d.managerName,d.dispatchAddress,d.DCNO,d.batchId,d.product20L,d.product1L,d.product500ML,d.product300ML,d.product2L,d.driverName,d.dispatchTo,d.dispatchedDate,dri.mobileNumber,v.vehicleType,v.vehicleNo from dispatches d INNER JOIN VehicleDetails v ON d.vehicleNo=v.vehicleId INNER JOIN driverdetails dri on d.driverId=dri.driverId WHERE d.departmentId=${departmentId} ORDER BY d.dispatchedDate DESC`;
    return executeGetQuery(query, callback)
}
motherPlantDbQueries.getDispatchDetailsByDate = async (input, callback) => {
    const { departmentId, date } = input
    let query = `SELECT d.status,d.dispatchType,d.dispatchAddress,d.DCNO,d.batchId,d.product20L,d.product1L,d.product500ML,d.product300ML,d.product2L,d.driverName,d.dispatchTo,d.dispatchedDate,dri.mobileNumber,v.vehicleType,v.vehicleNo from dispatches d INNER JOIN VehicleDetails v ON d.vehicleNo=v.vehicleId INNER JOIN driverdetails dri on d.driverId=dri.driverId WHERE d.departmentId=? ORDER BY d.dispatchedDate DESC LIMIT 4`;
    return executeGetParamsQuery(query, [departmentId], callback)
}
motherPlantDbQueries.getAllQCDetails = async (callback) => {
    let query = "select * from qualitycontrol";
    return executeGetQuery(query, callback)
}

motherPlantDbQueries.getProductionQcList = async (departmentId, callback) => {
    let query = `select * from productionQC where departmentId=${departmentId} ORDER BY requestedDate DESC`;
    return executeGetQuery(query, callback)
}
motherPlantDbQueries.getProductionQcBatchIds = async (departmentId, callback) => {
    let query = "select productionQcId,batchId from productionQC where departmentId=? AND status=? ORDER BY requestedDate DESC";
    return executeGetParamsQuery(query, [departmentId, "Pending"], callback)
}
motherPlantDbQueries.getProductionBatchIds = async ({ departmentId, shiftType }, callback) => {
    let query = "select productionQcId,batchId from productionQC where departmentId=? AND shiftType=? AND productionCreated=0 AND status=? AND outOfStock='0' ORDER BY requestedDate DESC";
    return executeGetParamsQuery(query, [departmentId, shiftType, "Approved"], callback)
}
motherPlantDbQueries.getPostProductionBatchIds = async (departmentId, callback) => {
    let query = "select q.productionQcId,p.batchId from qualitycheck q INNER JOIN productionQC p ON q.productionQcId=p.productionQcId where q.departmentId=? AND q.testResult=? AND p.status='Approved' AND q.qcLevel != '1' AND p.outOfStock='0' ORDER BY q.testedDate DESC";
    return executeGetParamsQuery(query, [departmentId, "Approved"], callback)
}
motherPlantDbQueries.getQCDetailsByBatch = async (input, callback) => {
    const { batchId, departmentId } = input
    let query = `select * from productionQC where status='Pending' AND batchId=? AND departmentId=?`;
    return executeGetParamsQuery(query, [batchId, departmentId], callback)
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
    if (input.isSuperAdmin == 'true') {
        query = `select r.*,d.departmentName from requiredrawmaterial r INNER JOIN departmentmaster d ON r.departmentId=d.departmentId ORDER BY r.requestedDate DESC`
        return executeGetQuery(query, callback)
    } else {
        if (input.status) query = `select * from requiredrawmaterial WHERE departmentId=? AND (status="Approved" or status="Confirmed") ORDER BY requestedDate DESC`
        return executeGetParamsQuery(query, [input.departmentId], callback)
    }
}
motherPlantDbQueries.getCurrentRMDetails = async (input, callback) => {
    let query = `select * from rawmaterialdetails WHERE departmentId=? ORDER BY createdDateTime DESC`;
    if (input.isSuperAdmin == 'true') {
        query = `select r.*,d.departmentName from rawmaterialdetails r INNER JOIN departmentmaster d ON r.departmentId=d.departmentId ORDER BY r.createdDateTime DESC`
        return executeGetQuery(query, callback)
    } else {
        if (input.status) query = `select * from rawmaterialdetails WHERE departmentId=? AND (status="Approved" or status="Confirmed") ORDER BY createdDateTime DESC`
        return executeGetParamsQuery(query, [input.departmentId], callback)
    }
}
motherPlantDbQueries.getRMReceiptDetails = async (input, callback) => {
    const { isSuperAdmin, departmentId } = input
    let query = `select rmr.receiptDate,rmr.receiptNo,rmr.invoiceNo,rmr.taxAmount,rmr.invoiceAmount,rmr.rawmaterialId,rmr.invoiceDate,rmr.managerName,rm.itemName,rm.itemCode,rm.itemQty,rm.vendorName,rm.requestedDate,rm.approvedDate,rm.description,rm.orderId from rawmaterialreceipt rmr INNER JOIN requiredrawmaterial rm on rmr.rawmaterialId=rm.rawmaterialid WHERE rmr.departmentId=${departmentId} ORDER BY receiptDate DESC`;
    if (isSuperAdmin == 'true') {
        query = `select rmr.taxAmount,rmr.receiptDate,rmr.receiptNo,rmr.invoiceNo,rmr.invoiceAmount,rmr.rawmaterialId,rmr.invoiceDate,rmr.managerName,rm.itemName,rm.itemCode,rm.itemQty,rm.vendorName,rm.requestedDate,rm.approvedDate,rm.description,rm.orderId,d.departmentName from rawmaterialreceipt rmr INNER JOIN requiredrawmaterial rm on rmr.rawmaterialId=rm.rawmaterialid INNER JOIN departmentmaster d ON rmr.departmentId=d.departmentId ORDER BY receiptDate DESC`;
    }
    return executeGetQuery(query, callback)
}

motherPlantDbQueries.getReceiptDetailsByRMId = async (input, callback) => {
    let query = `select rmr.receiptImage,rmr.receiptNo,rmr.invoiceNo,rmr.taxAmount,rmr.invoiceAmount,rmr.managerName,rmr.invoiceDate from rawmaterialreceipt rmr WHERE rmr.rawmaterialId=?`;
    return executeGetParamsQuery(query, [input.rmId], callback)
}
motherPlantDbQueries.getRMTotalCount = async (departmentId, callback) => {
    let query = `SELECT SUM(itemQty) AS itemCount, itemName FROM requiredrawmaterial where departmentId=${departmentId} AND status='Confirmed' GROUP BY itemName`;
    return executeGetQuery(query, callback)
}

motherPlantDbQueries.getDepartmentsList = async (deptType, callback) => {
    let query = `select departmentId,departmentName from departmentmaster where isApproved='1' AND deleted='0' AND departmentType="${deptType}"`
    return executeGetQuery(query, callback)
}
motherPlantDbQueries.getAllDepartmentsList = async (availableOnly, callback) => {
    let query = `select * from departmentmaster WHERE deleted='0' ORDER BY createdDateTime DESC`
    if (availableOnly == 'true') {
        query = `select * from departmentmaster WHERE deleted='0' AND adminId!='NULL' ORDER BY createdDateTime DESC`
    }
    return executeGetQuery(query, callback)
}
motherPlantDbQueries.getQCTestedBatches = async (departmentId, callback) => {
    let query = `select q.phLevel,q.TDS,q.ozoneLevel,q.managerName,q.testResult,q.testedDate,p.batchId,p.phLevel as ph,p.TDS as tds,p.ozoneLevel as oz,p.requestedDate from qualitycheck q INNER JOIN productionQC p on q.productionQcId=p.productionQcId  where q.departmentId=${departmentId} AND q.qcLevel='1' ORDER BY q.testedDate DESC`
    return executeGetQuery(query, callback)
}
motherPlantDbQueries.getQCTestResults = async (input, callback) => {
    let { departmentId, startDate, endDate, fromStart, shiftType } = input;
    let options = [endDate]
    let query = `SELECT JSON_ARRAYAGG(JSON_OBJECT('phLevel',ROUND(q.phLevel,1),'tds',ROUND(q.TDS,1),'ozoneLevel',ROUND(q.ozoneLevel,1),'qcLevel',q.qcLevel,'testResult',q.testResult,'managerName',q.managerName,'testingDate',q.testedDate)) levels,p.batchId batchId, p.shiftType,p.productionQcId,d.departmentName FROM qualitycheck q INNER JOIN productionQC p ON q.productionQcId=p.productionQcId INNER JOIN departmentmaster d ON p.departmentId=d.departmentId WHERE q.qcLevel=2 AND DATE(q.testedDate)<=? GROUP BY q.productionQcId ORDER BY p.requestedDate DESC`;

    if (departmentId === 'All' && shiftType === 'All' && fromStart != 'true') {
        options = [startDate, endDate]
        query = `SELECT JSON_ARRAYAGG(JSON_OBJECT('phLevel',ROUND(q.phLevel,1),'tds',ROUND(q.TDS,1),'ozoneLevel',ROUND(q.ozoneLevel,1),'qcLevel',q.qcLevel,'testResult',q.testResult,'managerName',q.managerName,'testingDate',q.testedDate)) levels,p.batchId batchId, p.shiftType,p.productionQcId,d.departmentName FROM qualitycheck q INNER JOIN productionQC p ON q.productionQcId=p.productionQcId INNER JOIN departmentmaster d ON p.departmentId=d.departmentId WHERE q.qcLevel=2 AND DATE(q.testedDate)>=? AND DATE(q.testedDate)<=? GROUP BY q.productionQcId  ORDER BY p.requestedDate DESC`;
    }
    else if (departmentId !== 'All' && shiftType && shiftType !== 'All') {
        options = [departmentId, shiftType, endDate]
        query = `SELECT JSON_ARRAYAGG(JSON_OBJECT('phLevel',ROUND(q.phLevel,1),'tds',ROUND(q.TDS,1),'ozoneLevel',ROUND(q.ozoneLevel,1),'qcLevel',q.qcLevel,'testResult',q.testResult,'managerName',q.managerName,'testingDate',q.testedDate)) levels,p.batchId batchId, p.shiftType,p.productionQcId,d.departmentName FROM qualitycheck q INNER JOIN productionQC p ON q.productionQcId=p.productionQcId INNER JOIN departmentmaster d ON p.departmentId=d.departmentId WHERE q.departmentId=? AND q.qcLevel=2 AND p.shiftType=? AND DATE(q.testedDate)<=? GROUP BY q.productionQcId  ORDER BY p.requestedDate DESC`;
        if (fromStart !== 'true') {
            options = [departmentId, shiftType, startDate, endDate]
            query = `SELECT JSON_ARRAYAGG(JSON_OBJECT('phLevel',ROUND(q.phLevel,1),'tds',ROUND(q.TDS,1),'ozoneLevel',ROUND(q.ozoneLevel,1),'qcLevel',q.qcLevel,'testResult',q.testResult,'managerName',q.managerName,'testingDate',q.testedDate)) levels,p.batchId batchId, p.shiftType,p.productionQcId,d.departmentName FROM qualitycheck q INNER JOIN productionQC p ON q.productionQcId=p.productionQcId INNER JOIN departmentmaster d ON p.departmentId=d.departmentId WHERE q.departmentId=? AND q.qcLevel=2 AND p.shiftType=? AND DATE(q.testedDate)>=? AND DATE(q.testedDate)<=?  GROUP BY q.productionQcId  ORDER BY p.requestedDate DESC`;
        }
    }
    else if (departmentId !== 'All') {
        options = [departmentId, endDate]
        query = `SELECT JSON_ARRAYAGG(JSON_OBJECT('phLevel',ROUND(q.phLevel,1),'tds',ROUND(q.TDS,1),'ozoneLevel',ROUND(q.ozoneLevel,1),'qcLevel',q.qcLevel,'testResult',q.testResult,'managerName',q.managerName,'testingDate',q.testedDate)) levels,p.batchId batchId, p.shiftType,p.productionQcId,d.departmentName FROM qualitycheck q INNER JOIN productionQC p ON q.productionQcId=p.productionQcId INNER JOIN departmentmaster d ON p.departmentId=d.departmentId WHERE q.departmentId=? AND q.qcLevel=2 AND DATE(q.testedDate)<=? GROUP BY q.productionQcId  ORDER BY p.requestedDate DESC`;
        if (fromStart !== 'true') {
            options = [departmentId, startDate, endDate]
            query = `SELECT JSON_ARRAYAGG(JSON_OBJECT('phLevel',ROUND(q.phLevel,1),'tds',ROUND(q.TDS,1),'ozoneLevel',ROUND(q.ozoneLevel,1),'qcLevel',q.qcLevel,'testResult',q.testResult,'managerName',q.managerName,'testingDate',q.testedDate)) levels,p.batchId batchId, p.shiftType,p.productionQcId,d.departmentName FROM qualitycheck q INNER JOIN productionQC p ON q.productionQcId=p.productionQcId INNER JOIN departmentmaster d ON p.departmentId=d.departmentId WHERE q.departmentId=? AND q.qcLevel=2 AND DATE(q.testedDate)>=? AND DATE(q.testedDate)<=?  GROUP BY q.productionQcId  ORDER BY p.requestedDate DESC`;
        }
    }
    else if (shiftType && shiftType !== 'All') {
        options = [shiftType, endDate]
        query = `SELECT JSON_ARRAYAGG(JSON_OBJECT('phLevel',ROUND(q.phLevel,1),'tds',ROUND(q.TDS,1),'ozoneLevel',ROUND(q.ozoneLevel,1),'qcLevel',q.qcLevel,'testResult',q.testResult,'managerName',q.managerName,'testingDate',q.testedDate)) levels,p.batchId batchId, p.shiftType,p.productionQcId,d.departmentName FROM qualitycheck q INNER JOIN productionQC p ON q.productionQcId=p.productionQcId INNER JOIN departmentmaster d ON p.departmentId=d.departmentId WHERE p.shiftType=? AND q.qcLevel=2 AND DATE(q.testedDate)<=? GROUP BY q.productionQcId  ORDER BY p.requestedDate DESC`;
        if (fromStart !== 'true') {
            options = [shiftType, startDate, endDate]
            query = `SELECT JSON_ARRAYAGG(JSON_OBJECT('phLevel',ROUND(q.phLevel,1),'tds',ROUND(q.TDS,1),'ozoneLevel',ROUND(q.ozoneLevel,1),'qcLevel',q.qcLevel,'testResult',q.testResult,'managerName',q.managerName,'testingDate',q.testedDate)) levels,p.batchId batchId, p.shiftType,p.productionQcId,d.departmentName FROM qualitycheck q INNER JOIN productionQC p ON q.productionQcId=p.productionQcId INNER JOIN departmentmaster d ON p.departmentId=d.departmentId WHERE p.shiftType=? AND q.qcLevel=2 AND DATE(q.testedDate)>=? AND DATE(q.testedDate)<=?  GROUP BY q.productionQcId  ORDER BY p.requestedDate DESC`;
        }
    }
    return executeGetParamsQuery(query, options, callback)
}
motherPlantDbQueries.getProdQCTestedBatches = async (departmentId, callback) => {
    let query = `SELECT JSON_ARRAYAGG(JSON_OBJECT('phLevel',ROUND(q.phLevel,1),'tds',ROUND(q.TDS,1),'ozoneLevel',ROUND(q.ozoneLevel,1),'qcLevel',q.qcLevel,'testResult',q.testResult,'managerName',q.managerName,'testingDate',q.testedDate)) levels,p.batchId batchId FROM qualitycheck q INNER JOIN productionQC p ON q.productionQcId=p.productionQcId WHERE q.departmentId=${departmentId} GROUP BY q.productionQcId ORDER BY p.batchId DESC`;
    return executeGetQuery(query, callback)
}
motherPlantDbQueries.getCurrentProductionDetailsByDate = async (input, callback) => {
    let query = "SELECT SUM(p.product20L) AS total20LCans,SUM(p.product1L) AS total1LBoxes,SUM(p.product500ML) total500MLBoxes,SUM(p.product300ML) total300MLBoxes,SUM(p.product2L) total2LBoxes,GROUP_CONCAT(p.batchId) AS batchIds FROM production p WHERE departmentId=? AND isApproved=1 AND DATE(`productionDate`)<=?";
    return executeGetParamsQuery(query, [input.departmentId, input.date], callback)
}
motherPlantDbQueries.getTotalProductionDetails = async (input, callback) => {
    let { departmentId, startDate, endDate, fromStart, shiftType } = input;
    let options = [departmentId, startDate, endDate]
    let query = "SELECT SUM(p.product20L) AS total20LCans,SUM(p.product1L) AS total1LBoxes,SUM(p.product500ML) total500MLBoxes,SUM(p.product300ML) total300MLBoxes,SUM(p.product2L) total2LBoxes,GROUP_CONCAT(p.batchId) AS batchIds FROM production p WHERE departmentId=? AND isApproved=1 AND DATE(`productionDate`)<=?";

    if (fromStart == 'true') {
        if (shiftType !== 'All') {
            options = [departmentId, endDate, shiftType]
            query = "SELECT SUM(p.product20L) AS total20LCans,SUM(p.product1L) AS total1LBoxes,SUM(p.product500ML) total500MLBoxes,SUM(p.product300ML) total300MLBoxes,SUM(p.product2L) total2LBoxes,GROUP_CONCAT(p.batchId) AS batchIds FROM production p WHERE departmentId=? AND isApproved=1 AND DATE(`productionDate`)<=?  AND shiftType=?";
        }
        else {
            options = [departmentId, endDate]
            query = "SELECT SUM(p.product20L) AS total20LCans,SUM(p.product1L) AS total1LBoxes,SUM(p.product500ML) total500MLBoxes,SUM(p.product300ML) total300MLBoxes,SUM(p.product2L) total2LBoxes,GROUP_CONCAT(p.batchId) AS batchIds FROM production p WHERE departmentId=? AND isApproved=1 AND DATE(`productionDate`)<=?";
        }
    }
    else {
        if (shiftType !== 'All') {
            options = [departmentId, startDate, endDate, shiftType]
            query = "SELECT SUM(p.product20L) AS total20LCans,SUM(p.product1L) AS total1LBoxes,SUM(p.product500ML) total500MLBoxes,SUM(p.product300ML) total300MLBoxes,SUM(p.product2L) total2LBoxes,GROUP_CONCAT(p.batchId) AS batchIds FROM production p WHERE departmentId=? AND isApproved=1 AND DATE(`productionDate`)>=? AND DATE(`productionDate`)<=? AND shiftType=?";
        }
        else {
            options = [departmentId, startDate, endDate]
            query = "SELECT SUM(p.product20L) AS total20LCans,SUM(p.product1L) AS total1LBoxes,SUM(p.product500ML) total500MLBoxes,SUM(p.product300ML) total300MLBoxes,SUM(p.product2L) total2LBoxes,GROUP_CONCAT(p.batchId) AS batchIds FROM production p WHERE departmentId=? AND isApproved=1 AND DATE(`productionDate`)>=? AND DATE(`productionDate`)<=?";
        }
    }
    return executeGetParamsQuery(query, options, callback)
}
motherPlantDbQueries.getTotalProductionByDate = async (input, callback) => {
    const { departmentId, startDate, endDate, shiftType, fromStart } = input
    let options = [departmentId, endDate]
    let query = "SELECT SUM(p.product20L) AS total20LCans,SUM(p.product1L) AS total1LBoxes,SUM(p.product500ML) total500MLBoxes,SUM(p.product300ML) total300MLBoxes,SUM(p.product2L) total2LBoxes FROM production p WHERE departmentId=? AND isApproved=1 AND DATE(`productionDate`)<=?";

    if (fromStart != 'true') {
        options = [departmentId, startDate, endDate]
        query = "SELECT SUM(p.product20L) AS total20LCans,SUM(p.product1L) AS total1LBoxes,SUM(p.product500ML) total500MLBoxes,SUM(p.product300ML) total300MLBoxes,SUM(p.product2L) total2LBoxes FROM production p WHERE departmentId=? AND isApproved=1 AND DATE(`productionDate`)>=? AND DATE(`productionDate`)<=?";
    }

    if (input.shiftType !== 'All') {
        options = [departmentId, endDate, shiftType]
        query = "SELECT SUM(p.product20L) AS total20LCans,SUM(p.product1L) AS total1LBoxes,SUM(p.product500ML) total500MLBoxes,SUM(p.product300ML) total300MLBoxes,SUM(p.product2L) total2LBoxes FROM production p WHERE departmentId=? AND isApproved=1 AND DATE(`productionDate`)<=? AND shiftType=?";

        if (fromStart != 'true') {
            options = [departmentId, startDate, endDate, shiftType]
            query = "SELECT SUM(p.product20L) AS total20LCans,SUM(p.product1L) AS total1LBoxes,SUM(p.product500ML) total500MLBoxes,SUM(p.product300ML) total300MLBoxes,SUM(p.product2L) total2LBoxes FROM production p WHERE departmentId=? AND isApproved=1 AND DATE(`productionDate`)>=? AND DATE(`productionDate`)<=? AND shiftType=?";
        }
    }
    return executeGetParamsQuery(query, options, callback)
}
motherPlantDbQueries.getTotalProductionChangeByDate = async (input, callback) => {
    const { departmentId, startDate, endDate, shiftType, type, fromStart } = input
    const { startDate: newStartDate, endDate: newEndDate } = dateComparisions(startDate, endDate, type)
    let options = [departmentId, newEndDate]
    let query = "SELECT SUM(p.product20L) AS total20LCans,SUM(p.product1L) AS total1LBoxes,SUM(p.product500ML) total500MLBoxes,SUM(p.product300ML) total300MLBoxes,SUM(p.product2L) total2LBoxes FROM production p WHERE departmentId=? AND isApproved=1 AND DATE(`productionDate`)<=?";

    if (fromStart != 'true') {
        options = [departmentId, newStartDate, newEndDate]
        query = "SELECT SUM(p.product20L) AS total20LCans,SUM(p.product1L) AS total1LBoxes,SUM(p.product500ML) total500MLBoxes,SUM(p.product300ML) total300MLBoxes,SUM(p.product2L) total2LBoxes FROM production p WHERE departmentId=? AND isApproved=1 AND DATE(`productionDate`)>=? AND DATE(`productionDate`)<=?";
    }

    if (input.shiftType !== 'All') {
        options = [departmentId, newEndDate, shiftType]
        query = "SELECT SUM(p.product20L) AS total20LCans,SUM(p.product1L) AS total1LBoxes,SUM(p.product500ML) total500MLBoxes,SUM(p.product300ML) total300MLBoxes,SUM(p.product2L) total2LBoxes FROM production p WHERE departmentId=? AND isApproved=1 AND DATE(`productionDate`)<=? AND shiftType=?";
        if (fromStart != 'true') {
            options = [departmentId, newStartDate, newEndDate, shiftType]
            query = "SELECT SUM(p.product20L) AS total20LCans,SUM(p.product1L) AS total1LBoxes,SUM(p.product500ML) total500MLBoxes,SUM(p.product300ML) total300MLBoxes,SUM(p.product2L) total2LBoxes FROM production p WHERE departmentId=? AND isApproved=1 AND DATE(`productionDate`)>=? AND DATE(`productionDate`)<=? AND shiftType=?";
        }
    }
    return executeGetParamsQuery(query, options, callback)
}
motherPlantDbQueries.getPDDetailsByDate = async (input, callback) => {
    let query = "SELECT SUM(d.product20L) AS total20LCans,SUM(d.product1L) AS total1LBoxes,SUM(d.product500ML) total500MLBoxes,SUM(d.product300ML) total300MLBoxes,SUM(d.product2L) total2LBoxes FROM dispatches d WHERE departmentId=? AND DATE(`dispatchedDate`)<=?";
    return executeGetParamsQuery(query, [input.departmentId, input.date], callback)
}
motherPlantDbQueries.getTotalPDDetails = async (input, callback) => {
    let { departmentId, startDate, endDate, fromStart, batchIds: bIds } = input;
    const batchIds = bIds && bIds.split(',')
    let options = [departmentId, endDate, batchIds]
    let query = "SELECT SUM(p.product20L) AS total20LCans,SUM(p.product1L) AS total1LBoxes,SUM(p.product500ML) total500MLBoxes,SUM(p.product300ML) total300MLBoxes,SUM(p.product2L) total2LBoxes FROM dispatches p WHERE departmentId=? AND DATE(`dispatchedDate`)<=? AND batchId IN (?)";

    if (fromStart == 'true') {
        options = [departmentId, endDate, batchIds]
        query = "SELECT SUM(p.product20L) AS total20LCans,SUM(p.product1L) AS total1LBoxes,SUM(p.product500ML) total500MLBoxes,SUM(p.product300ML) total300MLBoxes,SUM(p.product2L) total2LBoxes FROM dispatches p WHERE departmentId=? AND DATE(dispatchedDate)<=? AND batchId IN (?)";
    }
    else {
        options = [departmentId, startDate, endDate, batchIds]
        query = "SELECT SUM(p.product20L) AS total20LCans,SUM(p.product1L) AS total1LBoxes,SUM(p.product500ML) total500MLBoxes,SUM(p.product300ML) total300MLBoxes,SUM(p.product2L) total2LBoxes FROM dispatches p WHERE departmentId=? AND DATE(`dispatchedDate`)>=? AND DATE(`dispatchedDate`)<=? AND batchId IN (?)";
    }
    return executeGetParamsQuery(query, options, callback)
}
motherPlantDbQueries.getCurrentDispatchDetailsByDate = async (input, callback) => {
    let query = "SELECT JSON_ARRAYAGG(json_object('dcNo',d.DCNO,'isConfirmed',d.isConfirmed)) as DCDetails,SUM(d.product20L) AS total20LCans,SUM(d.product1L) AS total1LBoxes,SUM(d.product500ML) total500MLBoxes,SUM(d.product300ML) total300MLBoxes,SUM(d.product2L) total2LBoxes,SUM(r.damaged20LCans) damaged20LCans,SUM(r.damaged1LBoxes) damaged1LBoxes,SUM(r.damaged500MLBoxes) damaged500MLBoxes,SUM(r.damaged300MLBoxes) damaged300MLBoxes,SUM(r.damaged2LBoxes) damaged2LBoxes FROM dispatches d Left JOIN returnstockdetails r on d.returnStockId=r.id WHERE d.dispatchType='warehouse' AND dispatchTo=? AND DATE(`dispatchedDate`)=?";
    return executeGetParamsQuery(query, [input.departmentId, input.date], callback)
}
motherPlantDbQueries.getDispatchDetailsByDC = async (dcNo, callback) => {
    let query = `SELECT SUM(d.product20L) as product20L,SUM(d.product1L) as product1L,SUM(d.product500ML) as product500ML,SUM(d.product300ML) as product300ML,SUM(d.product2L) as product2L,dcNo,GROUP_CONCAT(managerName) AS managerName,GROUP_CONCAT(d.departmentId) as motherplantId,GROUP_CONCAT(v.vehicleType) vehicleType,GROUP_CONCAT(v.vehicleNo) vehicleNo,GROUP_CONCAT(driver.driverName) driverName,GROUP_CONCAT(driver.mobileNumber) mobileNumber,GROUP_CONCAT(dep.address) address,GROUP_CONCAT(dep.departmentName) departmentName
    FROM dispatches d INNER JOIN VehicleDetails v on d.vehicleNo=v.vehicleId INNER JOIN driverdetails driver on d.driverId=driver.driverId INNER JOIN departmentmaster dep on d.departmentId=dep.departmentId WHERE DCNO=?`;
    return executeGetParamsQuery(query, [dcNo], callback)
}
motherPlantDbQueries.getQCLevelsDetails = async (input, callback) => {
    const { productionQcId, departmentId } = input
    let query = "SELECT JSON_ARRAYAGG(JSON_OBJECT('testedDate',DATE_FORMAT(q.testedDate, '%Y-%m-%dT%H:%i:%s.000Z'),'phLevel',ROUND(q.phLevel,1),'tds',ROUND(q.TDS,1),'ozoneLevel',ROUND(q.ozoneLevel,1),'testResult',q.testResult,'managerName',q.managerName,'description',q.description,'testType',q.testType,'qcLevel',q.qcLevel)) AS QCDetails FROM qualitycheck q  WHERE productionQcId=? AND departmentId=?";
    return executeGetParamsQuery(query, [productionQcId, departmentId], callback)
}
motherPlantDbQueries.getTotalRevenue = async (input, callback) => {
    let { startDate, endDate, fromStart, departmentId } = input;
    let options = [endDate]
    let query = `SELECT CAST((SUM(20LCans * (price20L + (price20L * 12 / 100)))) AS DECIMAL(10,2)) product20LCount, CAST((SUM(1LBoxes * (price1L + (price1L * 18 / 100)))) AS DECIMAL(10,2)) product1LCount, CAST((SUM(500MLBoxes * (price500ML + (price500ML * 18 / 100)))) AS DECIMAL(10,2)) product500MLCount, CAST((SUM(300MLBoxes * (price300ML + (price300ML * 18 / 100)))) AS DECIMAL(10,2)) product300MLCount, CAST((SUM(2LBoxes * (price2L + (price2L * 18 / 100)))) AS DECIMAL(10,2)) product2LCount FROM customerorderdetails WHERE isDelivered='Completed' AND DATE(deliveredDate)<=?`;
    if (fromStart !== 'true' && departmentId == "All") {
        options = [startDate, endDate]
        query = ` SELECT CAST((SUM(20LCans * (price20L + (price20L * 12 / 100)))) AS DECIMAL(10,2)) product20LCount, CAST((SUM(1LBoxes * (price1L + (price1L * 18 / 100)))) AS DECIMAL(10,2)) product1LCount, CAST((SUM(500MLBoxes * (price500ML + (price500ML * 18 / 100)))) AS DECIMAL(10,2)) product500MLCount, CAST((SUM(300MLBoxes * (price300ML + (price300ML * 18 / 100)))) AS DECIMAL(10,2)) product300MLCount, CAST((SUM(2LBoxes * (price2L + (price2L * 18 / 100)))) AS DECIMAL(10,2)) product2LCount FROM customerorderdetails WHERE isDelivered='Completed' AND DATE(deliveredDate)>=? AND DATE(deliveredDate)<=?`;
    }
    else if (fromStart !== 'true' && departmentId !== "All") {
        options = [startDate, endDate, departmentId]
        query = ` SELECT CAST((SUM(20LCans * (price20L + (price20L * 12 / 100)))) AS DECIMAL(10,2)) product20LCount, CAST((SUM(1LBoxes * (price1L + (price1L * 18 / 100)))) AS DECIMAL(10,2)) product1LCount, CAST((SUM(500MLBoxes * (price500ML + (price500ML * 18 / 100)))) AS DECIMAL(10,2)) product500MLCount, CAST((SUM(300MLBoxes * (price300ML + (price300ML * 18 / 100)))) AS DECIMAL(10,2)) product300MLCount, CAST((SUM(2LBoxes * (price2L + (price2L * 18 / 100)))) AS DECIMAL(10,2)) product2LCount FROM customerorderdetails WHERE isDelivered='Completed' AND DATE(deliveredDate)>=? AND DATE(deliveredDate)<=? AND warehouseId=?`;
    }
    else if (fromStart == 'true' && departmentId !== "All") {
        options = [endDate, departmentId]
        query = `SELECT CAST((SUM(20LCans * (price20L + (price20L * 12 / 100)))) AS DECIMAL(10,2)) product20LCount, CAST((SUM(1LBoxes * (price1L + (price1L * 18 / 100)))) AS DECIMAL(10,2)) product1LCount, CAST((SUM(500MLBoxes * (price500ML + (price500ML * 18 / 100)))) AS DECIMAL(10,2)) product500MLCount, CAST((SUM(300MLBoxes * (price300ML + (price300ML * 18 / 100)))) AS DECIMAL(10,2)) product300MLCount, CAST((SUM(2LBoxes * (price2L + (price2L * 18 / 100)))) AS DECIMAL(10,2)) product2LCount FROM customerorderdetails WHERE isDelivered='Completed' AND DATE(deliveredDate)<=? AND warehouseId=?`;
    }
    return executeGetParamsQuery(query, options, callback)
}
motherPlantDbQueries.getTotalRevenueChange = async (input, callback) => {
    let { startDate, endDate, fromStart, type, departmentId } = input;
    const { startDate: newStartDate, endDate: newEndDate } = dateComparisions(startDate, endDate, type)
    let options = [newEndDate]
    let query = `SELECT CAST((SUM(20LCans * (price20L + (price20L * 12 / 100)))) AS DECIMAL(10,2)) product20LCount, CAST((SUM(1LBoxes * (price1L + (price1L * 18 / 100)))) AS DECIMAL(10,2)) product1LCount, CAST((SUM(500MLBoxes * (price500ML + (price500ML * 18 / 100)))) AS DECIMAL(10,2)) product500MLCount, CAST((SUM(300MLBoxes * (price300ML + (price300ML * 18 / 100)))) AS DECIMAL(10,2)) product300MLCount, CAST((SUM(2LBoxes * (price2L + (price2L * 18 / 100)))) AS DECIMAL(10,2)) product2LCount FROM customerorderdetails WHERE isDelivered='Completed' AND DATE(deliveredDate)<=?`;
    if (fromStart !== 'true' && departmentId == "All") {
        options = [newStartDate, newEndDate]
        query = ` SELECT CAST((SUM(20LCans * (price20L + (price20L * 12 / 100)))) AS DECIMAL(10,2)) product20LCount, CAST((SUM(1LBoxes * (price1L + (price1L * 18 / 100)))) AS DECIMAL(10,2)) product1LCount, CAST((SUM(500MLBoxes * (price500ML + (price500ML * 18 / 100)))) AS DECIMAL(10,2)) product500MLCount, CAST((SUM(300MLBoxes * (price300ML + (price300ML * 18 / 100)))) AS DECIMAL(10,2)) product300MLCount, CAST((SUM(2LBoxes * (price2L + (price2L * 18 / 100)))) AS DECIMAL(10,2)) product2LCount FROM customerorderdetails WHERE isDelivered='Completed' AND DATE(deliveredDate)>=? AND DATE(deliveredDate)<=?`;
    }
    else if (fromStart !== 'true' && departmentId !== "All") {
        options = [newStartDate, newEndDate, departmentId]
        query = ` SELECT CAST((SUM(20LCans * (price20L + (price20L * 12 / 100)))) AS DECIMAL(10,2)) product20LCount, CAST((SUM(1LBoxes * (price1L + (price1L * 18 / 100)))) AS DECIMAL(10,2)) product1LCount, CAST((SUM(500MLBoxes * (price500ML + (price500ML * 18 / 100)))) AS DECIMAL(10,2)) product500MLCount, CAST((SUM(300MLBoxes * (price300ML + (price300ML * 18 / 100)))) AS DECIMAL(10,2)) product300MLCount, CAST((SUM(2LBoxes * (price2L + (price2L * 18 / 100)))) AS DECIMAL(10,2)) product2LCount FROM customerorderdetails WHERE isDelivered='Completed' AND DATE(deliveredDate)>=? AND DATE(deliveredDate)<=? AND warehouseId=?`;
    }
    if (fromStart == 'true' && departmentId !== "All") {
        options = [newStartDate, newEndDate, departmentId]
        query = ` SELECT CAST((SUM(20LCans * (price20L + (price20L * 12 / 100)))) AS DECIMAL(10,2)) product20LCount, CAST((SUM(1LBoxes * (price1L + (price1L * 18 / 100)))) AS DECIMAL(10,2)) product1LCount, CAST((SUM(500MLBoxes * (price500ML + (price500ML * 18 / 100)))) AS DECIMAL(10,2)) product500MLCount, CAST((SUM(300MLBoxes * (price300ML + (price300ML * 18 / 100)))) AS DECIMAL(10,2)) product300MLCount, CAST((SUM(2LBoxes * (price2L + (price2L * 18 / 100)))) AS DECIMAL(10,2)) product2LCount FROM customerorderdetails WHERE isDelivered='Completed' AND DATE(deliveredDate)>=? AND DATE(deliveredDate)<=? AND warehouseId=?`;
    }
    return executeGetParamsQuery(query, options, callback)
}
//POST Request Methods
motherPlantDbQueries.createQC = async (input, callback) => {
    let query = "insert into qualitycontrol (reportdate,batchId,testType,reportImage,description) values(?,?,?,?,?)";
    let reportImage = input.reportImage && Buffer.from(input.reportImage.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let requestBody = [input.reportdate, input.batchId, input.testType, reportImage, input.description]
    return executePostOrUpdateQuery(query, requestBody, callback)
}
motherPlantDbQueries.createMotherPlant = async (input, callback) => {
    const { address, departmentName, city, state, pinCode, adminId, phoneNumber } = input
    let query = "insert into departmentmaster (departmentName,departmentType,gstNo,gstProof,address,city,state,pinCode,adminId,phoneNumber) values(?,?,?,?,?,?,?,?,?,?)";
    let gstProof = input.gstProof && Buffer.from(input.gstProof.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let requestBody = [departmentName, 'MotherPlant', input.gstNo, gstProof, address, city, state, pinCode, adminId, phoneNumber]
    return executePostOrUpdateQuery(query, requestBody, callback)
}
motherPlantDbQueries.updateMotherPlant = async (input, callback) => {
    const { address, departmentName, city, state, pinCode, adminId, phoneNumber, departmentId } = input
    let query = "update departmentmaster set departmentName=?,departmentType=?,gstNo=?,gstProof=?,address=?,city=?,state=?,pinCode=?,adminId=?,phoneNumber=? where departmentId=?";
    let gstProof = input.gstProof && Buffer.from(input.gstProof.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let requestBody = [departmentName, 'MotherPlant', input.gstNo, gstProof, address, city, state, pinCode, adminId, phoneNumber, departmentId]
    return executePostOrUpdateQuery(query, requestBody, callback)
}
motherPlantDbQueries.createProductionQC = async (input, callback) => {
    const { phLevel, TDS, ozoneLevel, managerName, shiftType, departmentId } = input
    let query = "insert into productionQC (requestedDate,phLevel,TDS,ozoneLevel,managerName,shiftType,departmentId) values(?,?,?,?,?,?,?)";
    let requestBody = [new Date(), phLevel, TDS, ozoneLevel, managerName, shiftType, departmentId]
    return executePostOrUpdateQuery(query, requestBody, callback)
}
motherPlantDbQueries.createQualityCheck = async (input, callback) => {
    const { productionQcId, phLevel, approveProd, batchId, TDS, ozoneLevel, testResult, managerName, description, testType, departmentId, qcLevel } = input
    let query = "insert into qualitycheck (testedDate,batchId,productionQcId,phLevel,TDS,ozoneLevel,testResult,managerName,description,testType,qcLevel,departmentId) values(?,?,?,?,?,?,?,?,?,?,?,?)";
    let requestBody = [new Date(), batchId, productionQcId, phLevel, TDS, ozoneLevel, testResult, managerName, description, testType, qcLevel, departmentId]
    if (qcLevel == 1) motherPlantDbQueries.updateProductionQCStatus({ productionQcId, status: testResult })
    if (qcLevel != 1 && testResult == 'Approved') {
        if (approveProd == 1) {
            motherPlantDbQueries.updateProductionQcCreatedStatus({ productionQcId })
            motherPlantDbQueries.updateProductionApprovedStatus({ batchId })
        }
    }
    return executePostOrUpdateQuery(query, requestBody, callback)
}
motherPlantDbQueries.createInternalQC = async (input, callback) => {
    let query = "insert into internalqualitycontrol (productionDate,batchId,testType,description) values(?,?,?,?,?)";
    let requestBody = [input.productionDate, input.batchId, input.testType, input.description]
    return executePostOrUpdateQuery(query, requestBody, callback)
}
motherPlantDbQueries.addProductionDetails = async (input, callback) => {
    let query = "insert into production (productionDate,phLevel,TDS,ozoneLevel,product20L, product1L, product500ML, product300ML,product2L,managerName,createdBy,shiftType,departmentId,batchId) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    let productionDate = new Date()
    let requestBody = [productionDate, input.phLevel, input.TDS, input.ozoneLevel, input.product20L, input.product1L, input.product500ML, input.product300ML, input.product2L, input.managerName, input.createdBy, input.shiftType, input.departmentId, input.batchId]
    return executePostOrUpdateQuery(query, requestBody, callback)
}
motherPlantDbQueries.addVehicleDetails = async (input, callback) => {
    const { vehicleNo, vehicleType, vehicleName } = input
    let query = "insert into VehicleDetails (vehicleNo,vehicleType,vehicleName) values(?,?,?)";
    let requestBody = [vehicleNo, vehicleType, vehicleName]
    return executePostOrUpdateQuery(query, requestBody, callback)
}
motherPlantDbQueries.updateVehicleDetails = async (input, callback) => {
    const { vehicleNo, vehicleType, vehicleName, vehicleId } = input
    let query = "update VehicleDetails set vehicleNo=?,vehicleType=?,vehicleName=? where vehicleId=?";
    let requestBody = [vehicleNo, vehicleType, vehicleName, vehicleId]
    return executePostOrUpdateQuery(query, requestBody, callback)
}
motherPlantDbQueries.addDispatchDetails = async (input, callback) => {
    let query = "insert into dispatches (dispatchedDate,vehicleNo,driverId,driverName,dispatchTo,batchId,product20L,product1L,product500ML,product300ML,product2L,dispatchAddress, dispatchType,departmentId) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    let requestBody = [input.dispatchedDate, input.vehicleNo, input.driverId, input.driverName, input.dispatchTo, input.batchId, input.product20L, input.product1L, input.product500ML, input.product300ML, input.product2L, input.dispatchAddress, input.dispatchType, input.departmentId]
    return executePostOrUpdateQuery(query, requestBody, callback)
}
motherPlantDbQueries.createRM = async (input, callback) => {
    let query = "insert into requiredrawmaterial (requestedDate,itemName,itemQty,description,reorderLevel,minOrderLevel,itemCode,vendorName,departmentId) values(?,?,?,?,?,?,?,?,?)";
    let requestBody = [input.requestedDate, input.itemName, input.itemQty, input.description, input.reorderLevel, input.minOrderLevel, input.itemCode, input.vendorName, input.departmentId]
    return executePostOrUpdateQuery(query, requestBody, callback)
}

motherPlantDbQueries.getRMDetailsByItemCode = async (itemCode, callback) => {
    let query = `Select * from rawmaterialdetails WHERE itemCode=${itemCode}`;
    return executeGetQuery(query, callback)
}

motherPlantDbQueries.insertRMDetails = async (input, callback) => {
    const { itemName, itemCode, reorderLevel, departmentId } = input
    let query = "insert into rawmaterialdetails (itemName,itemCode,reorderLevel,departmentId) values(?,?,?,?)";
    let requestBody = [itemName, itemCode, reorderLevel, itemCode, departmentId]
    return executePostOrUpdateQuery(query, requestBody, callback)
}

motherPlantDbQueries.updateRMDetailsStatus = async (input, callback) => {
    const { itemCode } = input
    let query = "UPDATE rawmaterialdetails SET isApproved=1 WHERE itemCode=?";
    let requestBody = [itemCode]
    return executePostOrUpdateQuery(query, requestBody, callback)
}

motherPlantDbQueries.updateRMDetailsDamageCount = async (input, callback) => {
    const { id, damagedCount } = input
    let query = "UPDATE rawmaterialdetails SET damagedCount=damagedCount+? WHERE id=?";
    let requestBody = [damagedCount, id]
    return executePostOrUpdateQuery(query, requestBody, callback)
}

motherPlantDbQueries.updateRMDetailsQuantity = async (input, callback) => {
    const { itemQty, itemCode } = input
    let query = "UPDATE rawmaterialdetails SET totalQuantity=totalQuantity + ? WHERE itemCode=?";
    let requestBody = [itemQty, itemCode]
    return executePostOrUpdateQuery(query, requestBody, callback)
}

motherPlantDbQueries.createRMReceipt = async (input, callback) => {
    let query = "insert into rawmaterialreceipt (receiptNo,invoiceNo,taxAmount,invoiceAmount,rawmaterialId,invoiceDate,departmentId,managerName,receiptImage) values(?,?,?,?,?,?,?,?,?)";
    const { receiptNo, invoiceNo, taxAmount, invoiceAmount, rawmaterialid, invoiceDate: date, departmentId, managerName } = input
    let invoiceDate = new Date(date)
    let receiptImage = input.receiptImage && Buffer.from(input.receiptImage.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let requestBody = [receiptNo, invoiceNo, taxAmount, invoiceAmount, rawmaterialid, invoiceDate, departmentId, managerName, receiptImage]
    return executePostOrUpdateQuery(query, requestBody, callback)
}

motherPlantDbQueries.updateProductionDetails = async (input, callback) => {
    let query = `update production set batchId=?,phLevel=?,TDS=?,ozoneLevel=?,product20L=?,product1L=?,product500ML=?,product300ML=?,product2L=?,managerName=?,shiftType=? where productionid=${input.productionid}`;
    let requestBody = [input.batchId, input.phLevel, input.TDS, input.ozoneLevel, input.product20L, input.product1L, input.product500ML, input.product300ML, input.product2L, input.managerName, input.shiftType]
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
    const { status, rawmaterialid, reason } = input
    let query = `update requiredrawmaterial set status=? where rawmaterialid=${rawmaterialid}`;
    let requestBody = [status]
    if (status == "Approved" || status == "Rejected") {
        query = `update requiredrawmaterial set status=?,approvedDate=?,reason=? where rawmaterialid=${rawmaterialid}`
        requestBody = [status, new Date(), reason]
        if (status == "Approved") {
            motherPlantDbQueries.updateRMDetailsStatus(input, (updateErr, success) => {
                if (updateErr) console.log("ERR", updateErr);
            })
        }
    }
    return executePostOrUpdateQuery(query, requestBody, callback)
}

motherPlantDbQueries.updateDispatchDetails = async (input, callback) => {
    const { dispatchType, DCNO, vehicleNo, driverId, driverName, dispatchTo, batchId, product20L, product1L, product500ML, product300ML, product2L, managerName, dispatchAddress } = input
    let query = `update dispatches SET dispatchType=?,DCNO=?,vehicleNo=?,driverId=?,driverName=?,dispatchTo=?,batchId=?,product20L=?,product1L=?,product500ML=?,product300ML=?,product2L=?,managerName=?,dispatchAddress=? where dispatchId="${input.dispatchId}"`;
    let requestBody = [dispatchType, DCNO, vehicleNo, driverId, driverName, dispatchTo, batchId, product20L, product1L, product500ML, product300ML, product2L, managerName, dispatchAddress]
    executePostOrUpdateQuery(query, requestBody, (err, data) => {
        if (err) callback(err, data)
        else {
            let getQuery = `SELECT d.dispatchAddress,d.dispatchType,d.DCNO,d.batchId,d.product20L,d.product1L,d.product500ML,d.product300ML,d.product2L,d.driverName,d.dispatchTo,d.dispatchedDate,v.vehicleType,v.vehicleNo from dispatches d INNER JOIN VehicleDetails v ON d.vehicleNo=v.vehicleId WHERE dispatchId=${input.dispatchId}`
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
motherPlantDbQueries.updateProductionQcCreatedStatus = (input, callback) => {
    let query = `update productionQC set productionCreated=? where productionQcId=${input.productionQcId}`;
    let requestBody = [1]
    return executePostOrUpdateQuery(query, requestBody, callback)
}
motherPlantDbQueries.updateProductionApprovedStatus = (input, callback) => {
    let query = `update production set isApproved=? where batchId=?`;
    let requestBody = [1, input.batchId]
    return executePostOrUpdateQuery(query, requestBody, callback)
}
motherPlantDbQueries.deleteVehicle = (vehicleId, callback) => {
    let query = `update VehicleDetails set deleted=? where vehicleId=${vehicleId}`;
    let requestBody = [1]
    return executePostOrUpdateQuery(query, requestBody, callback)
}
motherPlantDbQueries.updateEmptyCansStatus = async (input, callback) => {
    const { status, reason, id } = input
    let query = "update EmptyCanDetails set status=?,reason=?,approvedDate=? where id=?";
    let requestBody = [status, reason, new Date(), id]
    return executePostOrUpdateQuery(query, requestBody, callback)
}
motherPlantDbQueries.updateProductionQCStockStatus = async (batchId, callback) => {
    let query = "update productionQC set outOfStock='1' where batchId=?";
    let requestBody = [batchId]
    return executePostOrUpdateQuery(query, requestBody, callback)
}
module.exports = motherPlantDbQueries