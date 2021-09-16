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
    motherPlantDbQueries.getDepartmentNameByAdminId(userId, (err, data) => {
        if (err || !data.length) return obj
        else {
            obj.description = `Raw Material requested by <b>${data[0].departmentName}</b> admin`
            return obj;
        }
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
    motherPlantDbQueries.getAdminIdByDepartmentId(dispatchTo, (err, data) => {
        if (err || !data.length) return obj
        else obj.userIds = [{ userId: data[0].adminId }]
    })
    motherPlantDbQueries.getDepartmentNameByAdminId(userId, (err, data) => {
        if (err || !data.length) return obj
        else {
            obj.description = `Stock dispatched by <b>${data[0].departmentName}</b> admin`
            return obj;
        }
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
    motherPlantDbQueries.getAdminIdByDepartmentId(dispatchTo, (err, data) => {
        if (err || !data.length) return obj
        else obj.userIds = [{ userId: data[0].adminId }]
    })
    motherPlantDbQueries.getDepartmentNameByAdminId(userId, (err, data) => {
        if (err || !data.length) return obj
        else {
            obj.description = `Empty Cans ${status} by <b>${data[0].departmentName}</b> admin`
            return obj;
        }
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
    motherPlantDbQueries.getDepartmentNameByAdminId(userId, (err, data) => {
        if (err || !data.length) return obj
        else {
            obj.description = `Batch ${id} Quality Test ${status} by <b>${data[0].departmentName}</b> admin`
            return obj;
        }
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
    motherPlantDbQueries.getDepartmentNameByAdminId(userId, (err, data) => {
        if (err || !data.length) return obj
        else {
            obj.description = `Raw Materials confirmed by <b>${data[0].departmentName}</b> admin`
            return obj;
        }
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
    motherPlantDbQueries.getAdminIdByDepartmentId(motherplantId, (err, data) => {
        if (err || !data.length) return obj
        else obj.userIds = [{ userId: data[0].adminId }]
    })
    motherPlantDbQueries.getDepartmentNameByAdminId(userId, (err, data) => {
        if (err || !data.length) return obj
        else {
            obj.description = `Stock Details confirmed by <b>${data[0].departmentName}</b> admin`
            return obj;
        }
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
    motherPlantDbQueries.getAdminIdByDepartmentId(motherplantId, (err, data) => {
        if (err || !data.length) return obj
        else obj.userIds = [{ userId: data[0].adminId }]
    })
    motherPlantDbQueries.getDepartmentNameByAdminId(userId, (err, data) => {
        if (err || !data.length) return obj
        else {
            obj.description = `Empty cans returned by <b>${data[0].departmentName}</b> admin`
            return obj;
        }
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
    motherPlantDbQueries.getAdminIdByDepartmentId(motherplantId, (err, data) => {
        if (err || !data.length) return obj
        else obj.userIds = [{ userId: data[0].adminId }]
    })
    motherPlantDbQueries.getDepartmentNameByAdminId(userId, (err, data) => {
        if (err || !data.length) return obj
        else {
            obj.description = `Stock Requested by <b>${data[0].departmentName}</b> admin`
            return obj;
        }
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
    motherPlantDbQueries.getDepartmentNameByAdminId(userId, (err, data) => {
        if (err || !data.length) return obj
        else {
            obj.description = `${name} Route created by <b>${data[0].departmentName}</b> admin`
            return obj;
        }
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
    motherPlantDbQueries.getDepartmentNameByAdminId(userId, (err, data) => {
        if (err || !data.length) return obj
        else {
            obj.description = `Driver <b>${name}</b> updated by <b>${data[0].departmentName}</b> admin`
            return obj;
        }
    })
}

notificationContent.invoiceCreated = async ({ id, userId }) => {
    let obj = {
        title: "Invoice Created",
        description: `Invoice Created`,
        createdDateTime: new Date(),
        navigationUrl: null,
        isRead: 0,
        userRoles: [SUPERADMIN, ACCOUNTSADMIN]
    }
    motherPlantDbQueries.getDepartmentNameByAdminId(userId, (err, data) => {
        if (err || !data.length) return obj
        else {
            obj.description = `Invoice <b>${id}</b> created by <b>${data[0].departmentName}</b> admin`
            return obj;
        }
    })
}

module.exports = { notificationContent }