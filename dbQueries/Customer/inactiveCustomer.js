const { utils } = require('../../utils/functions.js');
const { executeGetQuery, executeGetParamsQuery, executePostOrUpdateQuery } = require('../../utils/functions.js');
const inactiveCustomerQueries = {}

inactiveCustomerQueries.getCustomerInactiveDetails = async (input, callback) => {
    const { customerId } = input
    let prevDate = utils.getRequiredDate(-3)
    let query = `SELECT createdDateTime FROM inactivecustomerdetails WHERE customerId=? AND DATE(createdDateTime)>?`
    return executeGetParamsQuery(query, [customerId, prevDate], callback)
}


inactiveCustomerQueries.addInactiveCustomerDetails = async (input, callback) => {
    const { customerId, lastDeliveredDate } = input
    let query = `insert into inactivecustomerdetails (customerId,createdDateTime,lastDeliveredDate) values(?,?,?)`;
    let requestBody = [customerId, new Date(), lastDeliveredDate]

    executePostOrUpdateQuery(query, requestBody, callback)
}

module.exports = { inactiveCustomerQueries }

// if data found then no need to insert else nneed to insert before insert need to get the last deliveredDate of the user