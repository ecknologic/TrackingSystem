var dayjs = require('dayjs')
const { FULLTIMEFORMAT } = require('../../utils/constants.js');
const { executeGetQuery, executeGetParamsQuery, executePostOrUpdateQuery, dateComparisions } = require('../../utils/functions.js');
let departmenttransactionQueries = {}

departmenttransactionQueries.getDepartmentTransactions = (customerId, callback) => {
    let query = "SELECT c.customerName,u.userName,a.description,a.createdDateTime from auditlogs a INNER JOIN usermaster u ON a.userId=u.userId INNER JOIN customerdetails c ON a.customerId=c.customerId WHERE a.customerId=" + customerId
    executeGetQuery(query, callback)
}

//POST Request Methods
departmenttransactionQueries.createDepartmentTransaction = (input, callback) => {
    let { userId, description, transactionId, type, departmentId } = input
    let query = `insert into departmenttransactions (userId, createdDateTime, description, transactionId, type,departmentId) values(?,?,?,?,?,?)`;
    let requestBody = [userId, new Date(), description, transactionId, type, departmentId]
    executePostOrUpdateQuery(query, requestBody, callback)
}

module.exports = departmenttransactionQueries