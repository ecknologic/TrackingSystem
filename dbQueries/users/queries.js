const { executeGetQuery, executeGetParamsQuery, executePostOrUpdateQuery } = require('../../utils/functions.js');
let usersQueries = {}

usersQueries.checkUserIsValidOrNot = (input, callback) => {
    const { username } = input
    let query = "select userId,loginId,emailid from usermaster where (loginId=? OR emailid=?) AND isActive=1 AND deleted=0"
    let requestBody = [username, username];
    return executeGetParamsQuery(query, requestBody, callback)
}

usersQueries.getUserPassword = (input, callback) => {
    const { userId } = input
    let query = `select password from usermaster WHERE isActive=1 AND deleted=0 AND userId=?`
    let requestBody = [userId];
    return executeGetParamsQuery(query, requestBody, callback)
}

usersQueries.checkUserTokenExistsOrNot = (input, callback) => {
    const { emailid } = input
    let query = "select emailid from usermaster where emailid=? AND isActive=1 AND deleted=0 AND token IS NOT NULL"
    let requestBody = [emailid];
    return executeGetParamsQuery(query, requestBody, callback)
}

usersQueries.getUsers = async (callback) => {
    let query = "SELECT u.userId,u.createdDateTime,u.userName,u.address,u.RoleId,u.isActive,u.emailid,u.mobileNumber,d.departmentName from usermaster u LEFT JOIN departmentmaster d ON u.departmentId=d.departmentId where u.deleted='0' ORDER BY u.createdDateTime DESC";
    return executeGetQuery(query, callback)
}
usersQueries.getUsersBydepartmentType = async (departmentType, callback) => {
    let query = "SELECT u.userId,u.userName,u.emailid,u.mobileNumber,r.RoleId as roleId from usermaster u INNER JOIN rolemaster r on u.RoleId=r.RoleId where u.RoleId=? AND u.deleted='0' ORDER BY createdDateTime DESC";
    return executeGetParamsQuery(query, [departmentType == "MotherPlant" ? '2' : '3'], callback)
}
usersQueries.getUsersByRole = async (roleName, callback) => {
    let query = "SELECT u.userId,u.userName,u.emailid,u.mobileNumber,r.RoleId as roleId,r.RoleName from usermaster u INNER JOIN rolemaster r on u.RoleId=r.RoleId where r.RoleName=? AND u.deleted='0' ORDER BY createdDateTime DESC";
    return executeGetParamsQuery(query, [roleName], callback)
}
usersQueries.getSalesPersons = async (callback) => {
    let query = "SELECT userId,userName from usermaster u where (roleId=4 or roleId=5) AND isActive=1 AND deleted='0' ORDER BY createdDateTime DESC";
    return executeGetParamsQuery(query, callback)
}
usersQueries.getUsersById = async (userId, callback) => {
    let query = "SELECT u.*,s.adharNo as dependentAdharNo,s.adhar_frontside as dependentFrontProof,s.adhar_backside as dependentBackProof,JSON_OBJECT('name',s.name,'userId',s.userId,'dob',s.dob,'gender',s.gender,'mobileNumber',s.mobileNumber,'relation',s.relation,'dependentId',s.dependentId) dependentDetails from usermaster u LEFT JOIN staffDependentDetails s on u.userId=s.userId where u.userId=" + userId;
    // let query = "SELECT u.*,s.adharNo as dependentAdharNo,s.adhar_frontside as dependentFrontProof,s.adhar_backside as dependentBackProof,JSON_OBJECT('name',s.name,'userId',s.userId,'dob',s.dob,'gender',s.gender,'mobileNumber',s.mobileNumber,'relation',s.relation,'dependentId',s.dependentId) dependentDetails from usermaster u INNER JOIN staffDependentDetails s on u.userId=s.userId where u.userId=" + userId;
    return executeGetQuery(query, callback)
}
usersQueries.getUserDetailsById = async (userId, callback) => {
    let query = `SELECT u.userName,u.roleId,u.departmentId,u.emailid,u.mobileNumber,u.joinedDate,u.parentName,u.gender,u.dob,u.adharNo,u.address,u.permanentAddress,u.adhar_frontside,u.adhar_backside,u.
    accountNo,u.bankName,u.branchName,u.ifscCode,u.recommendedBy,u.recruitedBy,u.bloodGroup,r.RoleName AS roleName,d.departmentName FROM usermaster u
    INNER JOIN rolemaster r ON u.roleId=r.RoleId LEFT JOIN departmentmaster d ON u.roleId=d.departmentId  WHERE u.userId=${userId}`;
    return executeGetQuery(query, callback)
}
usersQueries.getDependentDetailsById = async (dependentId, callback) => {
    let query = "SELECT name, dob, gender, adhar_frontside,adhar_backside, mobileNumber, relation, adharNo from staffDependentDetails where dependentId=" + dependentId;
    return executeGetQuery(query, callback)
}

usersQueries.saveDependentDetails = (input, tableName, callback) => {
    let query = `insert into ${tableName} (name,dob,gender,adhar_frontside,adhar_backside,mobileNumber,relation,userId,createdDateTime,adharNo) values(?,?,?,?,?,?,?,?,?,?)`;
    const { name, dob, gender, adharProof, adharNo, mobileNumber, relation, userId } = input
    let adhar_front = adharProof && adharProof.Front && Buffer.from(adharProof.Front.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let adhar_back = adharProof && adharProof.Front && Buffer.from(adharProof.Back.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let requestBody = [name, dob, gender, adhar_front, adhar_back, mobileNumber, relation, userId, new Date(), adharNo]
    return executePostOrUpdateQuery(query, requestBody, callback)
}
usersQueries.updateDependentDetails = (input, tableName, callback) => {
    let query = `update ${tableName} set name=?,dob=?,gender=?,adhar_frontside=?,adhar_backside=?,mobileNumber=?,relation=?,adharNo=? where dependentId=?`;
    const { name, dob, gender, adharProof, mobileNumber, relation, dependentId, adharNo } = input
    let adhar_front = adharProof && adharProof.Front && Buffer.from(adharProof.Front.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let adhar_back = adharProof && adharProof.Back && Buffer.from(adharProof.Back.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let requestBody = [name, dob, gender, adhar_front, adhar_back, mobileNumber, relation, adharNo, dependentId]
    return executePostOrUpdateQuery(query, requestBody, callback)
}
//Update Request Methods
usersQueries.updateUserDepartment = (input, callback) => {
    const { departmentId, userId, removedAdminId } = input
    if (removedAdminId) {
        let query1 = "update usermaster set departmentId=? where userId=?";
        executePostOrUpdateQuery(query1, [null, removedAdminId])
    }
    let query = "update usermaster set departmentId=? where userId=?";
    let requestBody = [departmentId, userId];
    return executePostOrUpdateQuery(query, requestBody, callback)
}
usersQueries.deleteWebUser = (userId, callback) => {
    let query = "update usermaster set deleted=? where userId=?"
    let requestBody = [1, userId];
    return executePostOrUpdateQuery(query, requestBody, callback)
}
usersQueries.updateWebUserActiveStatus = (input, callback) => {
    const { userId, status } = input
    let query = "update usermaster set isActive=? where userId=?"
    let requestBody = [status, userId];
    return executePostOrUpdateQuery(query, requestBody, callback)
}
usersQueries.removeDepartmentAdmin = async (departmentId) => {
    let query = "UPDATE departmentmaster SET adminId=? WHERE departmentId=?";
    return executeGetParamsQuery(query, [null, departmentId])
}
usersQueries.addDepartmentAdmin = async (input) => {
    const { departmentId, userId } = input
    let query = "UPDATE departmentmaster SET adminId=? WHERE departmentId=?";
    return executeGetParamsQuery(query, [userId, departmentId])
}

usersQueries.updateUserToken = (input, callback) => {
    const { emailid, token, isTokenExists } = input
    let query = "Update usermaster SET token=? where emailid=?"
    if (isTokenExists != false) query = query + ' AND token IS NOT NULL'
    let requestBody = [token, emailid];
    return executePostOrUpdateQuery(query, requestBody, callback)
}

module.exports = usersQueries