const { executeGetQuery, executeGetParamsQuery, executePostOrUpdateQuery } = require('../../utils/functions.js');
let usersQueries = {}

usersQueries.getUsers = async (callback) => {
    let query = "SELECT userId,userName,address,RoleId,isActive,emailid,mobileNumber from usermaster ORDER BY createdDateTime DESC";
    return executeGetQuery(query, callback)
}
usersQueries.getUsersBydepartmentType = async (departmentType, callback) => {
    let query = "SELECT u.userId,u.userName,u.emailid,u.mobileNumber,r.RoleId as roleId from usermaster u INNER JOIN rolemaster r on u.RoleId=r.RoleId where u.RoleId=? ORDER BY createdDateTime DESC";
    return executeGetParamsQuery(query, [departmentType == "MotherPlant" ? '2' : '3'], callback)
}
usersQueries.getUsersByRole = async (roleName, callback) => {
    let query = "SELECT u.userId,u.userName,u.emailid,u.mobileNumber,r.RoleId as roleId,r.RoleName from usermaster u INNER JOIN rolemaster r on u.RoleId=r.RoleId where r.RoleName=? ORDER BY createdDateTime DESC";
    return executeGetParamsQuery(query, [roleName], callback)
}
usersQueries.getUsersById = async (userId, callback) => {
    let query = "SELECT u.*,JSON_OBJECT('name',s.name,'dob',s.dob,'gender',s.gender,'adhar_frontside',s.adhar_frontside,'adhar_backside',s.adhar_backside,'mobileNumber',s.mobileNumber,'relation',s.relation,'dependentId',s.dependentId) dependentDetails from usermaster u INNER JOIN staffDependentDetails s on u.userId=s.userId where u.userId=" + userId;
    return executeGetQuery(query, callback)
}
usersQueries.saveDependentDetails = (input, tableName, callback) => {
    let query = `insert into ${tableName} (name,dob,gender,adhar_frontside,adhar_backside,mobileNumber,relation,userId,createdDateTime) values(?,?,?,?,?,?,?,?,?)`;
    const { name, dob, gender, adharProof, mobileNumber, relation, userId } = input
    let adhar_front = Buffer.from(adharProof.Front.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let adhar_back = Buffer.from(adharProof.Back.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let requestBody = [name, dob, gender, adhar_front, adhar_back, mobileNumber, relation, userId, new Date()]
    return executePostOrUpdateQuery(query, requestBody, callback)
}
usersQueries.updateDependentDetails = (input, tableName, callback) => {
    let query = `update ${tableName} set name=?,dob=?,gender=?,adhar_frontside=?,adhar_backside=?,mobileNumber=?,relation=?,userId=? where dependentId=?`;
    const { name, dob, gender, adharProof, mobileNumber, relation, userId, dependentId } = input
    let adhar_front = Buffer.from(adharProof.Front.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let adhar_back = Buffer.from(adharProof.Back.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let requestBody = [name, dob, gender, adhar_front, adhar_back, mobileNumber, relation, userId, dependentId]
    return executePostOrUpdateQuery(query, requestBody, callback)
}
//Update Request Methods
usersQueries.updateUserDepartment = (input, callback) => {
    const { departmentId, userId, removedAdminId } = input
    if (removedAdminId) {
        let query1 = "update usermaster set departmentId=? where userId=?";
        executePostOrUpdateQuery(query1, ["Null", removedAdminId])
    }
    let query = "update usermaster set departmentId=? where userId=?";
    let requestBody = [departmentId, userId];
    return executePostOrUpdateQuery(query, requestBody, callback)
}
module.exports = usersQueries