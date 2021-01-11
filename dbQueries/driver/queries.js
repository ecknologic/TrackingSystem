const { executeGetQuery, executeGetParamsQuery, executePostOrUpdateQuery } = require('../../utils/functions.js');
let driverQueries = {}

driverQueries.getDrivers = async (callback) => {
    let query = `select d.*,d.driverName as userName from driverdetails d ORDER BY d.createdDateTime DESC`;
    return executeGetQuery(query, callback)
}

//POST Request Methods
driverQueries.createDriver = async (input, callback) => {
    const { userName, emailid, departmentId = 1, mobileNumber, joinedDate, parentName, gender, dob, adharNo, address, permanentAddress, licenseNo, adharProof, licenseProof } = input;
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
    let query = "update driverdetails set driverName=?,emailid=?,departmentId=?,mobileNumber=?,joinedDate=?,parentName=?,gender=?,dob=?,adharNo=?,address=?,permanentAddress=?,licenseNo=?,adharProof=?,licenseProof=?  where driverId=?";
    let aadhar = Buffer.from(adharProof.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let license = Buffer.from(licenseProof.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let requestBody = [userName, emailid, departmentId, mobileNumber, joinedDate, parentName, gender, dob, adharNo, address, permanentAddress, licenseNo, aadhar, license, driverId]
    return executePostOrUpdateQuery(query, requestBody, callback)
}

module.exports = driverQueries