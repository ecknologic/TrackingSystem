const { executeGetQuery, executeGetParamsQuery, executePostOrUpdateQuery } = require('../../utils/functions.js');
let driverQueries = {}

driverQueries.getDrivers = async (callback) => {
    let query = `select d.*,d.driverName as userName from driverdetails d ORDER BY d.createdDateTime DESC`;
    return executeGetQuery(query, callback)
}

//POST Request Methods
driverQueries.createDriver = async (input, callback) => {
    const { userName, emailid, departmentId = 1, mobileNumber, joinedDate, parentName, gender, dob, adharNo, address, permanentAddress, licenseNo } = input;
    let query = "insert into driverdetails (driverName,emailid,departmentId,mobileNumber,joinedDate,parentName,gender,dob,adharNo,address,permanentAddress,licenseNo) values(?,?,?,?,?,?,?,?,?,?,?,?)";
    let requestBody = [userName, emailid, departmentId, mobileNumber, joinedDate, parentName, gender, dob, adharNo, address, permanentAddress, licenseNo]
    return executePostOrUpdateQuery(query, requestBody, callback)
}


driverQueries.updateDriver = async (input, callback) => {
    const { userName, emailid, departmentId, mobileNumber, joinedDate, parentName, gender, dob, adharNo, address, permanentAddress, licenseNo, driverId } = input;
    let query = "update driverdetails set driverName=?,emailid=?,departmentId=?,mobileNumber=?,joinedDate=?,parentName=?,gender=?,dob=?,adharNo=?,address=?,permanentAddress=?,licenseNo=? where driverId=?";
    let requestBody = [userName, emailid, departmentId, mobileNumber, joinedDate, parentName, gender, dob, adharNo, address, permanentAddress, licenseNo, driverId]
    return executePostOrUpdateQuery(query, requestBody, callback)
}

module.exports = driverQueries