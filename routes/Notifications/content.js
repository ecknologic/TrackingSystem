const { notificationConstants } = require("./constants")
const { constants } = require("../../utils/constants")
const motherPlantDbQueries = require("../../dbQueries/motherplant/queries")

let notificationContent = {}
let { SUPERADMIN, MARKETINGMANAGER, ACCOUNTSADMIN } = constants

const getNavigationUrl = (type, id) => {
    switch (type) {
        case `${notificationConstants.CUSTOMER_CREATED}`: return `/customers/approval/${id}`
        case `${notificationConstants.DELIVERY_DETAILS_ADDED}`: return `/customers/manage/${id}/2`
        default: return null
    }
}

notificationContent.customerCreated = async ({ name, userName, id, isSuperAdminApproved }) => {
    return {
        title: `Customer ${isSuperAdminApproved ? 'approved' : 'created'}`,
        description: `<b>${name}</b> ${isSuperAdminApproved ? 'approved' : 'created'} by ${userName}`,
        createdDateTime: new Date(),
        navigationUrl: getNavigationUrl(notificationConstants.CUSTOMER_CREATED, id),
        isRead: 0,
        userRoles: isSuperAdminApproved ? [ACCOUNTSADMIN] : [SUPERADMIN, MARKETINGMANAGER, ACCOUNTSADMIN]
    }
}

notificationContent.deliveryDetailsApproved = async ({ name, userName, id, warehouseId }) => {
    let obj = {
        title: `Delivery Details`,
        description: `<b>${name}</b> delivery approved by ${userName}`,
        createdDateTime: new Date(),
        navigationUrl: getNavigationUrl(notificationConstants.DELIVERY_DETAILS_ADDED, id),
        isRead: 0,
        userRoles: [SUPERADMIN, MARKETINGMANAGER],
        userIds: []
    }
    return new Promise((resolve) => {
        motherPlantDbQueries.getAdminIdByDepartmentId(warehouseId, (err, data) => {
            if (err || !data.length) resolve(obj)
            else obj.userIds = data
        })

        resolve(obj)
    })
}

notificationContent.deliveryDetailsBulkApproved = async ({ name, userName, id, warehouseId }) => {
    let obj = {
        title: `Delivery Details`,
        description: `<b>${name}</b> delivery approved by ${userName}`,
        createdDateTime: new Date(),
        navigationUrl: null,
        isRead: 0,
        userIds: []
    }
    return new Promise((resolve) => {
        motherPlantDbQueries.getAdminIdByDepartmentId(warehouseId, (err, data) => {
            if (err || !data.length) resolve(obj)
            else {
                obj.userIds = data
                resolve(obj)
            }
        })
    })
}

notificationContent.customerApproved = async ({ name, userId, userName, id }) => {
    return {
        title: `Customer approved`,
        description: `<b>${name}</b> approved by ${userName}`,
        createdDateTime: new Date(),
        navigationUrl: getNavigationUrl(notificationConstants.CUSTOMER_CREATED, id),
        isRead: 0,
        userRoles: [MARKETINGMANAGER],
        userIds: [{ userId }]
    }
}

notificationContent.customerCreatedWithZeroDeposit = async ({ name, userName, id }) => {
    return {
        title: "Customer created",
        description: `<b>${name}</b> created by ${userName} with zero deposit amount`,
        createdDateTime: new Date(),
        navigationUrl: getNavigationUrl(notificationConstants.CUSTOMER_CREATED, id),
        isRead: 0,
        backgroundColor: 'rgba(233,6,20,0.2)',
        userRoles: [SUPERADMIN, MARKETINGMANAGER]
    }
}

notificationContent.customerCreatedWithLowPrice = async ({ name, userName, id }) => {
    return {
        title: "Customer created",
        description: `<b>${name}</b> created by ${userName} with low product price`,
        createdDateTime: new Date(),
        navigationUrl: getNavigationUrl(notificationConstants.CUSTOMER_CREATED, id),
        isRead: 0,
        backgroundColor: 'rgba(233,6,20,0.2)',
        userRoles: [SUPERADMIN, MARKETINGMANAGER]
    }
}

notificationContent.customerDeliveryDetailsAdded = async ({ name, userName, id }) => {
    return {
        title: "Delivery Details Added",
        description: `<b>${name}</b> Delivery Details added by ${userName}`,
        createdDateTime: new Date(),
        navigationUrl: getNavigationUrl(notificationConstants.DELIVERY_DETAILS_ADDED, id),
        isRead: 0,
        userRoles: [SUPERADMIN, MARKETINGMANAGER, ACCOUNTSADMIN]
    }
}

notificationContent.rmRequest = async ({ userName, id, userId }) => {
    let obj = {
        title: "Material Request",
        description: `Raw Material requested by <b>${userName}</b>`,
        createdDateTime: new Date(),
        navigationUrl: null,
        isRead: 0,
        userRoles: [SUPERADMIN]
    }
    return new Promise((resolve) => {
        motherPlantDbQueries.getDepartmentNameByAdminId(userId, (err, data) => {
            if (err || !data.length) return resolve(obj)
            else {
                obj.description = `Raw Material requested by <b>${data[0].departmentName}</b> admin`
                resolve(obj);
            }
        })
    })
}

notificationContent.stockDispatch = async ({ dispatchTo, userId }) => {
    let obj = {
        title: "Stock Dispatch",
        description: `Stock dispatched`,
        createdDateTime: new Date(),
        navigationUrl: null,
        isRead: 0,
        userIds: []
    }
    return new Promise((resolve) => {
        motherPlantDbQueries.getAdminIdByDepartmentId(dispatchTo, (err, data) => {
            if (err || !data.length) resolve(obj)
            else obj.userIds = data
        })
        motherPlantDbQueries.getDepartmentNameByAdminId(userId, (err, data) => {
            if (err || !data.length) resolve(obj)
            else {
                obj.description = `Stock dispatched by <b>${data[0].departmentName}</b> admin`
                resolve(obj);
            }
        })
    })
}


notificationContent.confirmEmptyCans = async ({ dispatchTo, userId, status }) => {
    let obj = {
        title: "Empty Cans Confirmation",
        description: `Empty Cans ${status}`,
        createdDateTime: new Date(),
        navigationUrl: null,
        isRead: 0,
        userIds: []
    }
    return new Promise((resolve) => {
        motherPlantDbQueries.getAdminIdByDepartmentId(dispatchTo, (err, data) => {
            if (err || !data.length) resolve(obj)
            else obj.userIds = data
        })
        motherPlantDbQueries.getDepartmentNameByAdminId(userId, (err, data) => {
            if (err || !data.length) resolve(obj)
            else {
                obj.description = `Empty Cans ${status} by <b>${data[0].departmentName}</b> admin`
                resolve(obj);
            }
        })
    })
}

notificationContent.qualityCheck = async ({ id, status, userId }) => {
    let obj = {
        title: "Quality Test",
        description: `Quality Test`,
        createdDateTime: new Date(),
        navigationUrl: null,
        isRead: 0,
        userRoles: [SUPERADMIN]
    }
    return new Promise((resolve) => {
        motherPlantDbQueries.getDepartmentNameByAdminId(userId, (err, data) => {
            if (err || !data.length) resolve(obj)
            else {
                obj.description = `Batch ${id} Quality Test ${status} by <b>${data[0].departmentName}</b> admin`
                resolve(obj);
            }
        })
    })
}

notificationContent.rmConfirmed = async ({ userId }) => {
    let obj = {
        title: "Required Raw Materials",
        description: `Raw Materials confirmed`,
        createdDateTime: new Date(),
        navigationUrl: null,
        isRead: 0,
        userRoles: [SUPERADMIN]
    }
    return new Promise((resolve) => {
        motherPlantDbQueries.getDepartmentNameByAdminId(userId, (err, data) => {
            if (err || !data.length) resolve(obj)
            else {
                obj.description = `Raw Materials confirmed by <b>${data[0].departmentName}</b> admin`
                resolve(obj);
            }
        })
    })
}

notificationContent.confirmStockReceived = async ({ motherplantId, userId }) => {
    let obj = {
        title: "Stock Received",
        description: `Stock Received`,
        createdDateTime: new Date(),
        navigationUrl: null,
        isRead: 0,
        userIds: []
    }
    return new Promise((resolve) => {
        motherPlantDbQueries.getAdminIdByDepartmentId(motherplantId, (err, data) => {
            if (err || !data.length) resolve(obj)
            else obj.userIds = data
        })
        motherPlantDbQueries.getDepartmentNameByAdminId(userId, (err, data) => {
            if (err || !data.length) resolve(obj)
            else {
                obj.description = `Stock Details confirmed by <b>${data[0].departmentName}</b> admin`
                resolve(obj);
            }
        })
    })
}

notificationContent.returnedEmptyCans = async ({ motherplantId, userId }) => {
    let obj = {
        title: "Empty Cans Returned",
        description: `Empty Cans Returned`,
        createdDateTime: new Date(),
        navigationUrl: null,
        isRead: 0,
        userIds: []
    }
    return new Promise((resolve) => {
        motherPlantDbQueries.getAdminIdByDepartmentId(motherplantId, (err, data) => {
            if (err || !data.length) resolve(obj)
            else obj.userIds = data
        })
        motherPlantDbQueries.getDepartmentNameByAdminId(userId, (err, data) => {
            if (err || !data.length) resolve(obj)
            else {
                obj.description = `Empty cans returned by <b>${data[0].departmentName}</b> admin`
                resolve(obj);
            }
        })
    })
}

notificationContent.requestStock = async ({ motherplantId, userId }) => {
    let obj = {
        title: "Stock Requested",
        description: `Stock Requested`,
        createdDateTime: new Date(),
        navigationUrl: null,
        isRead: 0,
        userIds: []
    }
    return new Promise((resolve) => {
        motherPlantDbQueries.getAdminIdByDepartmentId(motherplantId, (err, data) => {
            if (err || !data.length) resolve(obj)
            else obj.userIds = data
        })
        motherPlantDbQueries.getDepartmentNameByAdminId(userId, (err, data) => {
            if (err || !data.length) resolve(obj)
            else {
                obj.description = `Stock Requested by <b>${data[0].departmentName}</b> admin`
                resolve(obj);
            }
        })
    })
}

notificationContent.routeCreated = async ({ name, userId }) => {
    let obj = {
        title: "Route created",
        description: `Route Created`,
        createdDateTime: new Date(),
        navigationUrl: null,
        isRead: 0,
        userRoles: [SUPERADMIN]
    }
    return new Promise((resolve) => {
        motherPlantDbQueries.getDepartmentNameByAdminId(userId, (err, data) => {
            if (err || !data.length) resolve(obj)
            else {
                obj.description = `${name} Route created by <b>${data[0].departmentName}</b> admin`
                resolve(obj);
            }
        })
    })
}

notificationContent.driverUpdated = async ({ name, userId }) => {
    let obj = {
        title: "Driver Updated",
        description: `Driver Updated`,
        createdDateTime: new Date(),
        navigationUrl: null,
        isRead: 0,
        userRoles: [SUPERADMIN]
    }
    return new Promise((resolve) => {
        motherPlantDbQueries.getDepartmentNameByAdminId(userId, (err, data) => {
            if (err || !data.length) resolve(obj)
            else {
                obj.description = `Driver <b>${name}</b> updated by <b>${data[0].departmentName}</b> admin`
                resolve(obj);
            }
        })
    })
}

notificationContent.departmentInvoiceCreated = async ({ id, userId }) => {
    let obj = {
        title: "Invoice Created",
        description: `Invoice Created`,
        createdDateTime: new Date(),
        navigationUrl: null,
        isRead: 0,
        userRoles: [SUPERADMIN, ACCOUNTSADMIN]
    }
    return new Promise((resolve) => {
        motherPlantDbQueries.getDepartmentNameByAdminId(userId, (err, data) => {
            if (err || !data.length) resolve(obj)
            else {
                obj.description = `Invoice <b>${id}</b> created by <b>${data[0].departmentName}</b> admin`
                resolve(obj);
            }
        })
    })
}

notificationContent.customerClosing = async ({ id, userName, warehouseId }) => {
    let obj = {
        title: "Customer Closing",
        description: `Customer Closing Initiated`,
        createdDateTime: new Date(),
        navigationUrl: null,
        isRead: 0,
        userIds: []
    }
    return new Promise((resolve) => {
        motherPlantDbQueries.getAdminIdByDepartmentId(warehouseId, (err, data) => {
            if (err || !data.length) resolve(obj)
            else {
                obj.description = `Customer Closing ${id} initiated by <b>${userName}</b>`
                obj.userIds = data
                resolve(obj);
            }
        })
    })
}

notificationContent.customerClosingUpdated = async ({ id, userId }) => {
    let obj = {
        title: "Customer Closing",
        description: `Customer Closing Confirmed`,
        createdDateTime: new Date(),
        navigationUrl: null,
        isRead: 0,
        userRoles: [ACCOUNTSADMIN]
    }
    return new Promise((resolve) => {
        motherPlantDbQueries.getDepartmentNameByAdminId(userId, (err, data) => {
            if (err || !data.length) resolve(obj)
            else {
                obj.description = `Customer Closing ${id} Details Confirmed by <b>${data[0].departmentName}</b> admin`
                resolve(obj);
            }
        })
    })
}

notificationContent.invoiceCreated = async ({ userName }) => {
    let obj = {
        title: "Invoice Created",
        description: `Invoice Created by <b>${userName}</b>`,
        createdDateTime: new Date(),
        navigationUrl: null,
        isRead: 0,
        userRoles: [SUPERADMIN]
    }
    return obj
}

module.exports = { notificationContent }