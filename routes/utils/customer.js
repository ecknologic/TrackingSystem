const dayjs = require("dayjs");
const customerClosingQueries = require("../../dbQueries/Customer/closing");
var customerQueries = require("../../dbQueries/Customer/queries");
const { DATEFORMAT } = require("../../utils/constants");
const { encryptObj } = require("../../utils/crypto");

const compareCustomerData = (data, { userId, userRole, userName }) => {
    const { customerId, salesAgentName } = data
    return new Promise((resolve) => {
        customerQueries.getCustomerDetails(customerId, (err, results) => {
            if (err) resolve([])
            else if (results.length) {
                const oldData = results[0]
                const records = []
                const createdDateTime = new Date()
                Object.entries(data).map(([key, updatedValue]) => {
                    const oldValue = oldData[key]
                    if (oldValue != updatedValue && key != 'salesAgentName' && key != 'idProofs' && key != 'gstProof') {
                        records.push({
                            oldValue: key == 'salesAgent' ? oldData.salesAgentName : oldValue,
                            updatedValue: key == 'salesAgent' ? salesAgentName : updatedValue,
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
                const { departmentName, routeName } = data
                const oldData = results[0]
                const records = []
                const createdDateTime = new Date()
                Object.entries(data).map(([key, updatedValue]) => {
                    const oldValue = oldData[key]
                    if (oldValue != updatedValue && key != 'idProofs' && key != 'departmentName' && key != 'routeName' && key != 'gstProof') {
                        records.push({
                            oldValue: key == 'routeId' ? oldData.routeName : key == 'departmentId' ? oldData.departmentName : oldValue,
                            updatedValue: key == 'routeId' ? routeName : key == 'departmentId' ? departmentName : updatedValue,
                            createdDateTime,
                            userId,
                            description: `Updated Customer Delivery Details ${getKeyName(key)} by ${userRole} <b>(${userName})</b>`,
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

const compareProductsData = (data, { type = "customer", customerId, userId, userRole, userName }) => {
    const { productId, productName } = data;
    return new Promise((resolve) => {
        customerQueries.getProductDetailsById(productId, (err, results) => {
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
                            description: `Updated ${type == 'customer' ? 'Customer' : 'Distributor'} product ${getProductKeyName(productName, key)} by ${userRole} <b>(${userName})</b>`,
                            customerId,
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
const compareOrderData = (data, { departmentId, transactionId, userId, userRole, userName }) => {
    return new Promise((resolve) => {
        customerQueries.getOrderDetails(transactionId, (err, results) => {
            if (err) resolve([])
            else if (results.length) {
                const oldData = results[0]
                const records = []
                const createdDateTime = new Date()
                Object.entries(data).map(([key, updatedValue]) => {
                    let oldValue = oldData[key]
                    if (oldValue != updatedValue && key != 'routeName' && key != 'driverName' && key != 'idProofs' && key != 'gstProof') {
                        const { routeName, driverName } = data
                        const { routeName: route, driverName: driver } = oldData
                        oldValue = key == 'routeId' ? route : driver
                        updatedValue = key == 'routeId' ? routeName : driverName
                        records.push({
                            oldValue,
                            updatedValue,  //Need routeName and driverName from frontEnd
                            createdDateTime,
                            userId,
                            description: `Updated DC ${getDCKeyName(key)} by ${userRole} <b>(${userName})</b>`,
                            transactionId,
                            departmentId,
                            type: 'warehouse', subType: 'delivery'
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

const compareDCDataByRoute = (data, { departmentId, userId, userRole, userName }) => {
    const { routeId, driverName, selectedDate } = data
    return new Promise((resolve) => {
        customerQueries.getOrderDetailsByRoute({ routeId, selectedDate }, (err, results) => {
            if (err) resolve([])
            else if (results.length) {
                const records = []
                const createdDateTime = new Date()
                results.map(item => {
                    const { driverName: driver } = item
                    oldValue = driver
                    updatedValue = driverName
                    if (oldValue != updatedValue) {
                        records.push({
                            oldValue,
                            updatedValue,
                            createdDateTime,
                            userId,
                            description: `Updated DC ${getDCKeyName('driverId')} by ${userRole} <b>(${userName})</b>`,
                            transactionId: item.customerOrderId,
                            departmentId,
                            type: 'warehouse', subType: 'delivery'
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

const compareOrdersDataByRoute = (data, { userId, userRole, userName }) => {
    const { routeId, driverName, departmentId } = data
    return new Promise((resolve) => {
        customerQueries.getDeliveryDetailsByRoute({ routeId, departmentId }, (err, results) => {
            if (err) resolve([])
            else if (results.length) {
                const records = []
                const createdDateTime = new Date()
                results.map(item => {
                    const { driverName: driver } = item
                    oldValue = driver
                    updatedValue = driverName
                    if (oldValue != updatedValue) {
                        records.push({
                            oldValue,
                            updatedValue,
                            createdDateTime,
                            userId,
                            description: `Updated Order driver by ${userRole} <b>(${userName})</b>`,
                            transactionId: item.deliveryDetailsId,
                            departmentId,
                            type: 'warehouse', subType: 'order'
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

const compareCustomerOrderData = (data, { departmentId, transactionId, userId, userRole, userName }) => {
    return new Promise((resolve) => {
        customerQueries.getOrderDetailsById(transactionId, (err, results) => {
            if (err) resolve([])
            else if (results.length) {
                const oldData = results[0]
                const records = []
                const createdDateTime = new Date()
                Object.entries(data).map(([key, updatedValue]) => {
                    let oldValue = oldData[key]
                    if (oldValue != updatedValue && key != 'routeName' && key != 'vehicleName' && key != 'driverName') {
                        const { routeName, driverName, vehicleName } = data
                        const { routeName: route, driverName: driver, vehicleName: vehicle } = oldData
                        updatedValue = key == 'routeId' ? routeName : key == 'driverId' ? driverName : vehicleName
                        oldValue = key == 'routeId' ? route : key == 'driverId' ? driver : vehicle
                        records.push({
                            oldValue,
                            updatedValue,  //Need routeName and driverName from frontEnd
                            createdDateTime,
                            userId,
                            description: `Updated order ${getDCKeyName(key)} by ${userRole} <b>(${userName})</b>`,
                            transactionId,
                            departmentId,
                            type: 'warehouse', subType: 'order'
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

const compareCustomerEnquiryData = (data, { userId, userRole, userName }) => {
    const { enquiryId, salesAgentName } = data
    return new Promise((resolve) => {
        customerQueries.getCustomerEnquiryById(enquiryId, (err, results) => {
            if (err) resolve([])
            else if (results.length) {
                const oldData = results[0]
                const records = []
                const createdDateTime = new Date()
                Object.entries(data).map(([key, updatedValue]) => {
                    const oldValue = oldData[key]
                    if (oldValue != updatedValue && key != 'salesAgentName' && key != 'products' && key != 'idProofs' && key != 'gstProof') {
                        records.push({
                            oldValue: key == 'salesAgent' ? oldData.salesAgentName : oldValue,
                            updatedValue: key == 'salesAgent' ? salesAgentName : updatedValue,
                            createdDateTime,
                            userId,
                            description: `Updated Enquiry ${key} by ${userRole} <b>(${userName})</b>`,
                            customerId: enquiryId,
                            type: "customerEnquiry"
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

const compareCustomerClosingData = (data, { userId, userRole, userName }) => {
    const { closingId, departmentName, routeName } = data
    return new Promise((resolve) => {
        customerClosingQueries.getCustomerClosingDetailsById(closingId, (err, results) => {
            if (err) resolve([])
            else if (results.length) {
                const oldData = results[0]
                const records = []
                const createdDateTime = new Date()
                Object.entries(data).map(async ([key, updatedValue]) => {
                    const oldValue = key == 'accountDetails' ? JSON.parse(oldData[key]) : oldData[key]
                    if ((key == 'closingDate' || key == 'collectedDate') && dayjs(oldValue).format(DATEFORMAT) != dayjs(updatedValue).format(DATEFORMAT)) {
                        records.push({
                            oldValue: dayjs(oldValue).format(DATEFORMAT),
                            updatedValue: dayjs(updatedValue).format(DATEFORMAT),
                            createdDateTime,
                            userId,
                            description: `Updated ${key} by ${userRole} <b>(${userName})</b>`,
                            customerId: closingId,
                            type: "customerClosing"
                        })
                    }
                    else if (key == 'accountDetails') {
                        let encryptedValue = await encryptObj(updatedValue)
                        Object.entries(encryptedValue).map(([accountKey, updatedAccountValue]) => {
                            const oldAccountValue = oldValue[accountKey]
                            if (accountKey == 'customerName') updatedAccountValue = updatedValue[accountKey]
                            if (oldAccountValue != updatedAccountValue && accountKey != 'accountId') {
                                records.push({
                                    oldValue: oldAccountValue,
                                    updatedValue: updatedAccountValue,
                                    createdDateTime,
                                    userId,
                                    description: `Updated account details (${accountKey}) by ${userRole} <b>(${userName})</b>`,
                                    customerId: closingId,
                                    type: "customerClosing"
                                })
                            }
                        })
                    }
                    else if (oldValue != updatedValue && key != 'RouteName' && key != 'routeName' && key != 'createdBy' && key != 'departmentName' && key != 'createdDateTime' && key != 'location') {
                        if (key == 'isConfirmed') {
                            records.push({
                                createdDateTime,
                                userId,
                                description: `Closing Details Confirmed by ${userRole} <b>(${userName})</b>`,
                                customerId: closingId,
                                type: "customerClosing"
                            })
                        }
                        else {
                            records.push({
                                oldValue: key == 'departmentId' ? oldData.departmentName : key == 'routeId' ? oldData.RouteName : oldValue,
                                updatedValue: key == 'departmentId' ? departmentName : key == 'routeId' ? routeName : updatedValue,
                                createdDateTime,
                                userId,
                                description: `Updated ${key} by ${userRole} <b>(${userName})</b>`,
                                customerId: closingId,
                                type: "customerClosing"
                            })
                        }
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

const getProductKeyName = (productName, key) => {
    if (key == 'noOfJarsTobePlaced') return `${productName} quantity`
    else if (key == 'productPrice') return `${productName} price`
}

const getDCKeyName = (key) => {
    if (key == 'routeId') return `route`
    else if (key == 'driverId') return `driver`
    else if (key == 'vehicleId') return `vehicle`
}

const getKeyName = (key) => {
    if (key == 'routeId') return `route`
    else if (key == 'driverId') return `driver`
    else if (key == 'departmentId') return `department`
    else return key
}
module.exports = { compareOrdersDataByRoute, compareDCDataByRoute, compareCustomerData, compareCustomerClosingData, compareCustomerEnquiryData, compareCustomerOrderData, compareProductsData, compareCustomerDeliveryData, compareOrderData }