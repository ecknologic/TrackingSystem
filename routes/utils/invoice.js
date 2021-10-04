const invoiceQueries = require("../../dbQueries/invoice/queries");

const compareInvoiceData = (data, { type = "invoice", userId, userRole, userName }) => {
    const { invoiceIds } = data;
    return new Promise((resolve) => {
        invoiceQueries.getSalesAgentByInvoiceIds({ invoiceIds }, (err, results) => {
            console.log('results', JSON.stringify(results), invoiceIds)
            if (err) resolve([])
            else if (results.length) {
                const records = []
                for (let [index, i] of results.entries()) {
                    const oldData = i
                    const createdDateTime = new Date()
                    Object.entries(data).map(([key, updatedValue]) => {
                        const oldValue = oldData[key]
                        if (oldValue != updatedValue && key == 'salesPerson') {
                            records.push({
                                oldValue,
                                updatedValue,
                                createdDateTime,
                                userId,
                                description: `Updated sales agent by ${userRole} <b>(${userName})</b>`,
                                genericId: i.invoiceId,
                                type
                            })
                        }
                    })
                    if (index == (results.length - 1)) resolve(records)
                }
            }
            else {
                resolve([])
            }
        })
    })
}

module.exports = { compareInvoiceData }