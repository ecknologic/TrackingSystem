var dayjs = require('dayjs')
const { FULLTIMEFORMAT } = require('../../utils/constants.js');
const { executeGetQuery, executeGetParamsQuery, executePostOrUpdateQuery, dateComparisions } = require('../../utils/functions.js');
const { getDeliverysByCustomerOrderId } = require('../warehouse/queries.js');
let auditQueries = {}

auditQueries.getAudits = (input, callback) => {
    let { type, id } = input
    let query = "SELECT c.customerName,u.userName,a.description,a.createdDateTime from auditlogs a INNER JOIN usermaster u ON a.userId=u.userId INNER JOIN customerdetails c ON a.customerId=c.customerId WHERE a.customerId=" + id
    executeGetQuery(query, callback)
}

//POST Request Methods
auditQueries.createLog = (input, callback) => {
    let query = `insert into auditlogs (userId, createdDateTime, description, customerId, type,departmentId) values(?,?,?,?,?,?)`;

    if (Array.isArray(input)) {
        if (input.length) executePostOrUpdateQuery(query, [input], callback)
    }
    else {
        let { userId, description, customerId, type, departmentId } = input
        let requestBody = [userId, new Date(), description, customerId, type, departmentId]
        executePostOrUpdateQuery(query, requestBody, callback)
    }
}

module.exports = auditQueries