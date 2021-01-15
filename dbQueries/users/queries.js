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
    let query = "SELECT * from usermaster where userId=" + userId;
    return executeGetQuery(query, callback)
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