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
                Object.entries(data).map(([key, updatedValue]) => {
                    const oldValue = oldData[key]
                    if (oldValue != updatedValue && key != 'idProofs' && key != 'gstProof') {
                        records.push({
                            oldValue,
                            updatedValue,
                            createdDateTime,
                            userId,
                            description: `Updated Customer ${key} by ${userRole} <b>(${userName})</b>`,
                            customerId,
                            type: "customer"
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


const compareCustomerDeliveryData = (data, { deliveryDetailsId, customerId, userId, userRole, userName }) => {
    return new Promise((resolve) => {
        customerQueries.getDeliveryDetailsById({ deliveryDetailsId }).then(results => {
            if (results.length) {
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
                            description: `Updated Customer Delivery Details ${key} by ${userRole} <b>(${userName})</b>`,
                            customerId,
                            type: "customer"
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

module.exports = { compareCustomerData, compareCustomerDeliveryData }