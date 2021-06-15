var distributorQueries = require("../../dbQueries/distributor/queries");

const compareDistributorData = (data, { customerId, userId, userRole, userName }) => {
    return new Promise((resolve) => {
        distributorQueries.getDistributorDetailsById(customerId, (err, results) => {
            if (err) resolve([])
            else if (results.length) {
                const oldData = results[0]
                const records = []
                const createdDateTime = new Date()
                Object.entries(data).map(([key, updatedValue]) => {
                    const oldValue = oldData[key]
                    if (oldValue != updatedValue && key != 'idProofs' && key != 'gstProof') {
                        records.push({
                            oldValue,
                            updatedValue,
                            createdDateTime,
                            userId,
                            description: `Updated Distributor ${key} by ${userRole} <b>(${userName})</b>`,
                            customerId,
                            type: "distributor"
                        })
                    }
                })
                resolve(records)
            }
            else {
                resolve([])
            }
        })
    })
}


module.exports = { compareDistributorData }