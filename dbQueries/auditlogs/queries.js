var dayjs = require('dayjs')
const { FULLTIMEFORMAT } = require('../../utils/constants.js');
const { executeGetQuery, executeGetParamsQuery, executePostOrUpdateQuery, dateComparisions } = require('../../utils/functions.js');
const { getDeliverysByCustomerOrderId } = require('../warehouse/queries.js');
let auditQueries = {}

auditQueries.getAudits = (customerId, callback) => {
    let query = "SELECT c.customerName,u.userName,a.description,a.createdDateTime from auditlogs a INNER JOIN usermaster u ON a.userId=u.userId INNER JOIN customerdetails c ON a.customerId=c.customerId WHERE a.customerId=" + customerId
    executeGetQuery(query, callback)
}

//POST Request Methods
auditQueries.createLog = (input, callback) => {
    let { userId, description, customerId, type, departmentId } = input
    let query = `insert into auditlogs (userId, createdDateTime, description, customerId, type,departmentId) values(?,?,?,?,?,?)`;
    let requestBody = [userId, new Date(), description, customerId, type, departmentId]
    executePostOrUpdateQuery(query, requestBody, callback)
}

module.exports = auditQueries