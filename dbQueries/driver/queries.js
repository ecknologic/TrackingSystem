const { executeGetQuery, executeGetParamsQuery, executePostOrUpdateQuery } = require('../../utils/functions.js');
let driverQueries = {}

driverQueries.getDrivers = async (callback) => {
    let query = `select d.driverId,d.driverName as userName,d.address,d.emailid,d.mobileNumber,d.isActive,dep.departmentName from driverdetails d LEFT JOIN departmentmaster dep on d.departmentId=dep.departmentId ORDER BY d.createdDateTime DESC`;
    return executeGetQuery(query, callback)
}
driverQueries.getDriverById = async (driverId, callback) => {
    let query = "SELECT d.*,d.driverName as userName,s.adharNo as dependentAdharNo,s.adhar_frontside as dependentFrontProof,s.adhar_backside as dependentBackProof,JSON_OBJECT('name',s.name,'userId',s.userId,'dob',s.dob,'gender',s.gender,'mobileNumber',s.mobileNumber,'relation',s.relation,'dependentId',s.dependentId) dependentDetails from driverdetails d INNER JOIN driverDependentDetails s on d.driverId=s.userId where d.driverId=" + driverId;
    return executeGetQuery(query, callback)
}

//POST Request Methods
driverQueries.createDriver = async (input, callback) => {
    const { userName, emailid, departmentId, mobileNumber, password, joinedDate, parentName, gender, dob, adharNo, address, permanentAddress, licenseNo, adharProof, licenseProof, accountNo, bankName, branchName, ifscCode, recommendedBy, recruitedBy } = input;
    let query = "insert into driverdetails (driverName,emailid,password,departmentId,mobileNumber,joinedDate,parentName,gender,dob,adharNo,address,permanentAddress,licenseNo,adhar_frontside, adhar_backside, license_frontside, license_backside,accountNo, bankName, branchName, ifscCode, recommendedBy, recruitedBy) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    let adhar_frontside = Buffer.from(adharProof.Front.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let adhar_backside = Buffer.from(adharProof.Back.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let license_frontside = Buffer.from(licenseProof.Front.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let license_backside = Buffer.from(licenseProof.Back.replace(/^data:image\/\w+;base64,/, ""), 'base64')

    let requestBody = [userName, emailid, password, departmentId, mobileNumber, joinedDate, parentName, gender, dob, adharNo, address, permanentAddress, licenseNo, adhar_frontside, adhar_backside, license_frontside, license_backside, accountNo, bankName, branchName, ifscCode, recommendedBy, recruitedBy]
    return executePostOrUpdateQuery(query, requestBody, callback)
}


driverQueries.updateDriver = async (input, callback) => {
    const { userName, emailid, departmentId, mobileNumber, joinedDate, parentName, gender, dob, adharNo, address, permanentAddress, licenseNo, driverId, adharProof, licenseProof, accountNo, bankName, branchName, ifscCode, recommendedBy, recruitedBy } = input;
    let query = "update driverdetails set driverName=?,emailid=?,departmentId=?,mobileNumber=?,joinedDate=?,parentName=?,gender=?,dob=?,adharNo=?,address=?,permanentAddress=?,licenseNo=?,adhar_frontside=?, adhar_backside=?, license_frontside=?, license_backside=?,accountNo=?, bankName=?, branchName=?, ifscCode=?, recommendedBy=?,recruitedBy=?  where driverId=?";
    let adhar_frontside = Buffer.from(adharProof.Front.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let adhar_backside = Buffer.from(adharProof.Back.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let license_frontside = Buffer.from(licenseProof.Front.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let license_backside = Buffer.from(licenseProof.Back.replace(/^data:image\/\w+;base64,/, ""), 'base64')
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

module.exports = driverQueries