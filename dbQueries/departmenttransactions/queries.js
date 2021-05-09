var dayjs = require('dayjs')
const { FULLTIMEFORMAT } = require('../../utils/constants.js');
const { executeGetQuery, executeGetParamsQuery, executePostOrUpdateQuery, dateComparisions } = require('../../utils/functions.js');
let departmenttransactionQueries = {}

departmenttransactionQueries.getDepartmentTransactions = (input, callback) => {
    const { id } = input
    let query = "SELECT a.auditId,a.description,a.createdDateTime,a.oldValue,a.updatedValue from departmenttransactions a.transactionId" + id
    executeGetQuery(query, callback)
}

//POST Request Methods
departmenttransactionQueries.createDepartmentTransaction = (input, callback) => {
    if (Array.isArray(input)) {
        if (input.length) {
            const { staffId, customerId, departmentId } = input[0]
            const id = customerId ? 'customerId' : staffId ? 'staffId' : departmentId ? 'departmentId' : ""
            const sql = input.map(item => "(" + item.userId + ", '" + dayjs(item.createdDateTime).format(FULLTIMEFORMAT) + "', '" + item.description + "', " + item.transactionId + ", '" + item.type + "'" + ", '" + item.subType + "'" + "," + item.departmentId + "" + ", '" + item.oldValue + "'" + ", '" + item.updatedValue + "'" + ")")
            let query = `insert into departmenttransactions (userId, createdDateTime, description, transactionId, type,subType,departmentId,oldValue,updatedValue) values ` + sql;
            executeGetQuery(query, callback)
        }
    }
    else {
        let { userId, description, transactionId, type, subType, departmentId } = input
        let query = `insert into departmenttransactions (userId, createdDateTime, description, transactionId, type,subType,departmentId) values(?,?,?,?,?,?,?)`;
        let requestBody = [userId, new Date(), description, transactionId, type, subType, departmentId]
        executePostOrUpdateQuery(query, requestBody, callback)
    }
}

module.exports = departmenttransactionQueries