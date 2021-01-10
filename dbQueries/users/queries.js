const { executeGetQuery, executeGetParamsQuery, executePostOrUpdateQuery } = require('../../utils/functions.js');
let usersQueries = {}


//Update Request Methods
usersQueries.updateUserDepartment = (input, callback) => {
    const { departmentId, userId } = input
    let query = "update usermaster set departmentId=? where userId=?";
    let requestBody = [departmentId, userId];
    executePostOrUpdateQuery(query, requestBody, callback)
}
module.exports = usersQueries