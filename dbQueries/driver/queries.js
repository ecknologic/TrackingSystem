const { executeGetQuery, executeGetParamsQuery, executePostOrUpdateQuery } = require('../../utils/functions.js');
let driverQueries = {}

driverQueries.getDrivers = async (callback) => {
    let query = `select d.*,d.driverName as userName from driverdetails d ORDER BY d.createdDateTime DESC`;
    return executeGetQuery(query, callback)
}
driverQueries.getDriverById = async (driverId, callback) => {
    let query = "SELECT d.*,d.driverName as userName,JSON_OBJECT('name',s.name,'dob',s.dob,'gender',s.gender,'adhar_frontside',s.adhar_frontside,'adhar_backside',s.adhar_backside,'mobileNumber',s.mobileNumber,'relation',s.relation,'dependentId',s.dependentId) dependentDetails from driverdetails d INNER JOIN driverDependentDetails s on d.driverId=s.userId where d.driverId=" + driverId;
    return executeGetQuery(query, callback)
}

//POST Request Methods
driverQueries.createDriver = async (input, callback) => {
    const { userName, emailid, departmentId, mobileNumber, joinedDate, parentName, gender, dob, adharNo, address, permanentAddress, licenseNo, adharProof, licenseProof } = input;
    let query = "insert into driverdetails (driverName,emailid,departmentId,mobileNumber,joinedDate,parentName,gender,dob,adharNo,address,permanentAddress,licenseNo,adhar_frontside, adhar_backside, license_frontside, license_backside) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    let adhar_frontside = Buffer.from(adharProof.Front.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let adhar_backside = Buffer.from(adharProof.Back.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let license_frontside = Buffer.from(licenseProof.Front.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let license_backside = Buffer.from(licenseProof.Back.replace(/^data:image\/\w+;base64,/, ""), 'base64')

    let requestBody = [userName, emailid, departmentId, mobileNumber, joinedDate, parentName, gender, dob, adharNo, address, permanentAddress, licenseNo, adhar_frontside, adhar_backside, license_frontside, license_backside]
    return executePostOrUpdateQuery(query, requestBody, callback)
}


driverQueries.updateDriver = async (input, callback) => {
    const { userName, emailid, departmentId, mobileNumber, joinedDate, parentName, gender, dob, adharNo, address, permanentAddress, licenseNo, driverId, adharProof, licenseProof } = input;
    let query = "update driverdetails set driverName=?,emailid=?,departmentId=?,mobileNumber=?,joinedDate=?,parentName=?,gender=?,dob=?,adharNo=?,address=?,permanentAddress=?,licenseNo=?,adhar_frontside=?, adhar_backside=?, license_frontside=?, license_backside=?  where driverId=?";
    let adhar_frontside = Buffer.from(adharProof.Front.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let adhar_backside = Buffer.from(adharProof.Back.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let license_frontside = Buffer.from(licenseProof.Front.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let license_backside = Buffer.from(licenseProof.Back.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let requestBody = [userName, emailid, departmentId, mobileNumber, joinedDate, parentName, gender, dob, adharNo, address, permanentAddress, licenseNo, adhar_frontside, adhar_backside, license_frontside, license_backside, driverId]
    return executePostOrUpdateQuery(query, requestBody, callback)
}

module.exports = driverQueries