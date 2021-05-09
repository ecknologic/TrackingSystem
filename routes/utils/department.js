var motherplantQueries = require("../../dbQueries/motherplant/queries");

const compareDepartmentData = (data, { departmentId, type, adminUserId: userId, userRole, userName }) => {
    return new Promise((resolve) => {
        motherplantQueries.getDepartmentDetailsById(departmentId, (err, results) => {
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
                            description: `Updated ${type == "motherplant" ? 'Motherplant' : 'Warehouse'} ${key} by ${userRole} <b>(${userName})</b>`,
                            departmentId,
                            type
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



module.exports = { compareDepartmentData }