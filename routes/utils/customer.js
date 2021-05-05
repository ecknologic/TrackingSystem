var customerQueries = require("../../dbQueries/Customer/queries");

const compareCustomerData = (data, { userId, userRole, userName }) => {
    const { customerId } = data
    return new Promise((resolve) => {
        customerQueries.getCustomerDetails(customerId, (err, results) => {
            if (err) resolve([])
            else if (results.length) {
                const oldData = results[0]
                const records = []
                const createdDateTime = new Date()
                Object.entries(data).map(([key, newValue]) => {
                    const oldValue = oldData[key]
                    console.log('key>>', key, oldValue != newValue && key != 'idProofs' && key != 'gstProof')
                    if (key != 'idProofs' && key != 'gstProof') {
                        console.log('old value >>>', oldValue)
                        console.log('new value >>>', newValue)
                    }
                    if (oldValue != newValue && key != 'idProofs' && key != 'gstProof') {
                        records.push({
                            oldValue,
                            newValue,
                            createdDateTime,
                            userId,
                            description: `Updated Customer ${key} by ${userRole} <b>(${userName})</b>`,
                            customerId,
                            type: "customer"
                        })
                    }
                })
                console.log('records>>', records)
                resolve(records)
            }
            else {
                resolve([])
            }
        })
    })
}

module.exports = { compareCustomerData }