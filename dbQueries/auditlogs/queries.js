var dayjs = require('dayjs')
const { FULLTIMEFORMAT } = require('../../utils/constants.js');
const { executeGetQuery, executeGetParamsQuery, executePostOrUpdateQuery, dateComparisions } = require('../../utils/functions.js');
const { getDeliverysByCustomerOrderId } = require('../warehouse/queries.js');
let auditQueries = {}

auditQueries.getAudits = (input, callback) => {
    let { type = 'customer', id } = input
    let query;
    if (type == 'staff' || type == 'driver') {
        query = `SELECT a.auditId,a.description,a.createdDateTime,a.oldValue,a.updatedValue from auditlogs a
        WHERE a.staffId=${id} ORDER BY a.createdDateTime DESC`
    }
    else if (type == 'customer'||type == 'customerEnquiry' || type == 'distributor') {
        query = `SELECT a.auditId,a.description,a.createdDateTime,a.oldValue,a.updatedValue from auditlogs a WHERE a.customerId=${id} ORDER BY a.createdDateTime DESC`
    }
    else if (type == 'motherplant' || type == 'warehouse') {
        query = `SELECT a.auditId,a.description,a.createdDateTime,a.oldValue,a.updatedValue from auditlogs a WHERE a.departmentId=${id} ORDER BY a.createdDateTime DESC`
    }
    executeGetQuery(query, callback)
}

//POST Request Methods
auditQueries.createLog = (input, callback) => {
    if (Array.isArray(input)) {
        if (input.length) {
            const { staffId, customerId, departmentId } = input[0]
            const id = customerId ? 'customerId' : staffId ? 'staffId' : departmentId ? 'departmentId' : ""
            const sql = input.map(item => "(" + item.userId + ", '" + dayjs(item.createdDateTime).format(FULLTIMEFORMAT) + "', '" + item.description + "', " + item[id] + ", '" + item.type + "'" + ", '" + item.oldValue + "'" + ", '" + item.updatedValue + "'" + ")")
            let query = `insert into auditlogs (userId, createdDateTime, description, ${id}, type,oldValue,updatedValue) values ` + sql;
            executeGetQuery(query, callback)
        }
    }
    else {
        let query = `insert into auditlogs (userId, createdDateTime, description, customerId, type,departmentId,staffId,oldValue,updatedValue) values(?,?,?,?,?,?,?,?,?)`;
        let { userId, description, customerId, type, staffId, departmentId, oldValue, updatedValue } = input
        let requestBody = [userId, new Date(), description, customerId, type, departmentId, staffId, oldValue, updatedValue]
        executePostOrUpdateQuery(query, requestBody, callback)
    }
}

module.exports = auditQueries