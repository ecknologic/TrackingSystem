const { executeGetQuery, executeGetParamsQuery, executePostOrUpdateQuery } = require('../../utils/functions.js');
let driverQueries = {}

driverQueries.getDrivers = async (callback) => {
    let query = `select d.driverId,d.driverName as userName,d.address,d.emailid,d.mobileNumber,d.isActive,dep.departmentName from driverdetails d LEFT JOIN departmentmaster dep on d.departmentId=dep.departmentId where d.deleted='0' ORDER BY d.createdDateTime DESC`;
    return executeGetQuery(query, callback)
}
driverQueries.getDriverById = async (driverId, callback) => {
    let query = "SELECT d.*,d.driverName as userName,s.adharNo as dependentAdharNo,s.adhar_frontside as dependentFrontProof,s.adhar_backside as dependentBackProof,JSON_OBJECT('name',s.name,'userId',s.userId,'dob',s.dob,'gender',s.gender,'mobileNumber',s.mobileNumber,'relation',s.relation,'dependentId',s.dependentId) dependentDetails,dep.departmentName from driverdetails d INNER JOIN driverDependentDetails s on d.driverId=s.userId LEFT JOIN departmentmaster dep ON d.departmentId=dep.departmentId where d.driverId=" + driverId;
    return executeGetQuery(query, callback)
}
driverQueries.getDriverDetailsById = async (driverId, callback) => {
    let query = `SELECT d.driverName AS userName,d.emailid,d.departmentId,d.mobileNumber,d.joinedDate,d.parentName,d.gender,d.dob,d.adharNo,d.address,d.permanentAddress,d.licenseNo,d.adhar_frontside,d.adhar_backside,d.license_frontside,d.license_backside,d.accountNo,d.bankName,d.branchName,d.ifscCode,d.recommendedBy,d.recruitedBy,
    r.RoleName AS roleName,dep.departmentName FROM driverdetails d INNER JOIN rolemaster r ON d.roleId=r.RoleId LEFT JOIN departmentmaster dep ON d.departmentId=dep.departmentId where driverId=${driverId}`;
    return executeGetQuery(query, callback)
}
driverQueries.getDriverDependentDetailsById = async (dependentId, callback) => {
    let query = "SELECT name, dob, gender, adhar_frontside,adhar_backside, mobileNumber, relation, adharNo from driverDependentDetails where dependentId=" + dependentId;
    return executeGetQuery(query, callback)
}
driverQueries.getOrderDetailsByOrderId = async (orderId, callback) => {
    let query = `SELECT customerType from customerorderdetails where customerOrderId=${orderId}`
    return executeGetQuery(query, callback)
}

driverQueries.getClosingCustomers = async (input, callback) => {
    const { date, driverId } = input
    let query = `SELECT cc.closingId,cc.customerName,cc.noOfCans,cc.collectedDate,cc.collectedCans,cc.missingCansCount,cc.status,cc.damagedCans,d.contactPerson,d.phoneNumber,d.latitude,d.longitude,d.address,c.customerNo from customerclosingdetails cc INNER JOIN DeliveryDetails d ON cc.deliveryDetailsId=d.deliveryDetailsId INNER JOIN customerdetails c ON c.customerId=cc.customerId where DATE(cc.driverAssignedOn)=? AND cc.driverId=?`
    return executeGetParamsQuery(query, [date, driverId], callback)
}

//POST Request Methods
driverQueries.createDriver = async (input, callback) => {
    const { userName, emailid, departmentId, mobileNumber, password, joinedDate, parentName, gender, dob, adharNo, address, permanentAddress, licenseNo, adharProof, licenseProof, accountNo, bankName, branchName, ifscCode, recommendedBy, recruitedBy } = input;
    let query = "insert into driverdetails (driverName,emailid,password,departmentId,mobileNumber,joinedDate,parentName,gender,dob,adharNo,address,permanentAddress,licenseNo,adhar_frontside, adhar_backside, license_frontside, license_backside,accountNo, bankName, branchName, ifscCode, recommendedBy, recruitedBy) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    let adhar_frontside = adharProof.Front && Buffer.from(adharProof.Front.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let adhar_backside = adharProof.Back && Buffer.from(adharProof.Back.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let license_frontside = licenseProof.Front && Buffer.from(licenseProof.Front.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let license_backside = licenseProof.Back && Buffer.from(licenseProof.Back.replace(/^data:image\/\w+;base64,/, ""), 'base64')

    let requestBody = [userName, emailid, password, departmentId, mobileNumber, joinedDate, parentName, gender, dob, adharNo, address, permanentAddress, licenseNo, adhar_frontside, adhar_backside, license_frontside, license_backside, accountNo, bankName, branchName, ifscCode, recommendedBy, recruitedBy]
    return executePostOrUpdateQuery(query, requestBody, callback)
}


driverQueries.updateDriver = async (input, callback) => {
    const { userName, emailid, departmentId, mobileNumber, joinedDate, parentName, gender, dob, adharNo, address, permanentAddress, licenseNo, driverId, adharProof, licenseProof, accountNo, bankName, branchName, ifscCode, recommendedBy, recruitedBy } = input;
    let query = "update driverdetails set driverName=?,emailid=?,departmentId=?,mobileNumber=?,joinedDate=?,parentName=?,gender=?,dob=?,adharNo=?,address=?,permanentAddress=?,licenseNo=?,adhar_frontside=?, adhar_backside=?, license_frontside=?, license_backside=?,accountNo=?, bankName=?, branchName=?, ifscCode=?, recommendedBy=?,recruitedBy=?  where driverId=?";
    let adhar_frontside = adharProof.Front && Buffer.from(adharProof.Front.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let adhar_backside = adharProof.Back && Buffer.from(adharProof.Back.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let license_frontside = licenseProof.Front && Buffer.from(licenseProof.Front.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let license_backside = licenseProof.Back && Buffer.from(licenseProof.Back.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let requestBody = [userName, emailid, departmentId, mobileNumber, joinedDate, parentName, gender, dob, adharNo, address, permanentAddress, licenseNo, adhar_frontside, adhar_backside, license_frontside, license_backside, accountNo, bankName, branchName, ifscCode, recommendedBy, recruitedBy, driverId]
    return executePostOrUpdateQuery(query, requestBody, callback)
}
driverQueries.updateDriverLoginId = (input, callback) => {
    const { driverName, driverId } = input
    let query = 'UPDATE driverdetails SET loginId=? WHERE driverId=?';
    let idValue = driverName.substring(0, 3) + driverId
    let requestBody = [idValue, driverId];
    return executePostOrUpdateQuery(query, requestBody, callback)
}
driverQueries.updateDeliveryStatus = (input, callback) => {
    const { status, orderId, customerNo } = input
    let query = "update customerorderdetails co INNER JOIN customerdetails c ON co.existingCustomerId=c.customerId set co.isDelivered=? where co.customerOrderId=? AND (c.customerNo=? OR co.distributorId=?)"
    let requestBody = [status, orderId, customerNo, customerNo];
    if (status == "Completed") {
        query = "update customerorderdetails co INNER JOIN customerdetails c ON co.existingCustomerId=c.customerId set isDelivered=?,deliveredDate=? where customerOrderId=? AND (c.customerNo=? OR co.distributorId=?)"
        requestBody = [status, new Date(), orderId, customerNo, customerNo]
    }
    return executePostOrUpdateQuery(query, requestBody, callback)
}

driverQueries.updateDeliveryProducts = (input, callback) => {
    const { deliveryProducts, orderId } = input
    const { product20L, product1L, product500ML, product300ML, product2L } = deliveryProducts
    let query = "update customerorderdetails set 20LCans=?,1LBoxes=?,500MLBoxes=?,300MLBoxes=?,2LBoxes=? where customerOrderId=?"
    let requestBody = [product20L, product1L, product500ML, product300ML, product2L, orderId];
    return executePostOrUpdateQuery(query, requestBody, callback)
}

driverQueries.updateDriverActiveStatus = (input, callback) => {
    const { driverId, status } = input
    let query = "update driverdetails set isActive=? where driverId=?"
    let requestBody = [status, driverId];
    return executePostOrUpdateQuery(query, requestBody, callback)
}
driverQueries.deleteDriver = (driverId, callback) => {
    let query = "update driverdetails set deleted=? where driverId=?"
    let requestBody = [1, driverId];
    return executePostOrUpdateQuery(query, requestBody, callback)
}

driverQueries.updateClosingCustomerDetails = async (input, callback) => {
    const { collectedDate, missingCansCount, collectedCans, damagedCans, closingId } = input
    let query = `update customerclosingdetails SET collectedDate=?,missingCansCount=?,collectedCans=?,damagedCans=? WHERE closingId=?`
    return executeGetParamsQuery(query, [collectedDate, missingCansCount, collectedCans, damagedCans, closingId], callback)
}

module.exports = driverQueries