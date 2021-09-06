const dayjs = require("dayjs");
const vendorQueries = require("../../dbQueries/vendors/queries");
const { DATEFORMAT } = require("../../utils/constants");
const { decryptObj } = require("../../utils/crypto");

const compareVendorData = (data, { vendorId, userId, userRole, userName }) => {
    return new Promise((resolve) => {
        vendorQueries.getVendorById(vendorId, async (err, results) => {
            if (err) resolve([])
            else if (results.length) {
                let oldData = results[0]
                const { accountNumber, ifscCode, bankName, branchName } = oldData
                let decryptedData = await decryptObj({ accountNumber, ifscCode, bankName, branchName })
                oldData = { ...results[0], accountNumber: decryptedData.accountNumber, ifscCode: decryptedData.ifscCode, bankName: decryptedData.bankName, branchName: decryptedData.branchName }
                const records = []
                const createdDateTime = new Date()
                Object.entries(data).map(([key, updatedValue]) => {
                    let oldValue = oldData[key]
                    if (oldValue != updatedValue && key != 'vendorId' && key != 'departmentName' && key != 'adhar_frontside' && key != 'adhar_backside' && key != 'license_frontside' && key != 'license_backside') {
                        records.push({
                            oldValue: oldValue,
                            updatedValue: updatedValue,
                            createdDateTime,
                            userId,
                            description: `Updated Vendor ${key} by ${userRole} <b>(${userName})</b>`,
                            genericId: vendorId,
                            type: "vendor"
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



module.exports = { compareVendorData }