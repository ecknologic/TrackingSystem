const { notificationConstants } = require("./constants")
const { constants } = require("../../utils/constants")

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

notificationContent.rmRequest = async ({ userName, id }) => {
    return {
        title: "Material Request",
        description: `Raw Material requested by <b>${userName}</b>`,
        createdDateTime: new Date(),
        navigationUrl: getNavigationUrl(notificationConstants.RM_REQUEST, id),
        isRead: 0,
        userRoles: [SUPERADMIN]
    }
}

module.exports = { notificationContent }