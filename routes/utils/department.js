const motherPlantDbQueries = require("../../dbQueries/motherplant/queries");
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

//Motherplant Current Stock
const compareCurrentStockLog = (data, { departmentId, itemCode, userId, userRole, userName }) => {
    return new Promise((resolve) => {
        motherPlantDbQueries.getCurrentRMDetailsByItemCode({itemCode,departmentId}, (err, results) => {
            if (err) resolve([])
            else if (results.length) {
                const oldData = results[0]
                const records = []
                const createdDateTime = new Date()
                Object.entries(data).map(([key, updatedValue]) => {
                    let oldValue = oldData[key]
                    if (oldValue != updatedValue) {
                        records.push({
                            oldValue,
                            updatedValue: oldValue + updatedValue,
                            createdDateTime,
                            userId,
                            description: `Updated current stock ${getCurrentStockKeyName(key)} by ${userRole} <b>(${userName})</b>`,
                            transactionId: oldData.id,
                            departmentId,
                            type: 'motherplant', subType: 'currentstock'
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

const getCurrentStockKeyName=(key)=>{
    if(key=='totalQuantity') return 'Total Quantity'
    if(key=='damagedCount') return 'Damaged Count'
}

module.exports = { compareDepartmentData, compareCurrentStockLog }