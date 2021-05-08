const dayjs = require("dayjs");
var userQueries = require("../../dbQueries/users/queries");
const { DATEFORMAT } = require("../../utils/constants");

const compareWebUserData = (data, { staffId, userId, userRole, adminUserName }) => {
    return new Promise((resolve) => {
        userQueries.getUserDetailsById(staffId, (err, results) => {
            if (err) resolve([])
            else if (results.length) {
                const oldData = results[0]
                const records = []
                const createdDateTime = new Date()
                Object.entries(data).map(([key, updatedValue]) => {
                    let oldValue = oldData[key]
                    if (key == 'joinedDate' || key == 'dob') {
                        oldValue = dayjs(oldValue).format(DATEFORMAT)
                        updatedValue = dayjs(updatedValue).format(DATEFORMAT)
                    }
                    if (oldValue != updatedValue && key != 'adhar_frontside' && key != 'adhar_backside') {
                        records.push({
                            oldValue,
                            updatedValue,
                            createdDateTime,
                            userId,
                            description: `Updated staff ${key} by ${userRole} <b>(${adminUserName})</b>`,
                            staffId,
                            type: "staff"
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


const compareWebUserDependentDetails = (data, { dependentId, staffId, userId, userRole, adminUserName }) => {
    return new Promise((resolve) => {
        userQueries.getDependentDetailsById(dependentId, (err, results) => {
            if (err) resolve([])
            else if (results.length) {
                const oldData = results[0]
                const records = []
                const createdDateTime = new Date()
                Object.entries(data).map(([key, updatedValue]) => {
                    let oldValue = oldData[key]
                    if (key == 'joinedDate' || key == 'dob') {
                        oldValue = dayjs(oldValue).format(DATEFORMAT)
                        updatedValue = dayjs(updatedValue).format(DATEFORMAT)
                    }
                     if (oldValue != updatedValue && key != 'adharProof' && key != 'adhar_frontside' && key != 'adhar_backside') {
                        records.push({
                            oldValue,
                            updatedValue,
                            createdDateTime,
                            userId,
                            description: `Updated staff dependent details ${key} by ${userRole} <b>(${adminUserName})</b>`,
                            staffId,
                            type: "staff"
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

module.exports = { compareWebUserData, compareWebUserDependentDetails }