const { notificationConstants } = require("./constants")
const { getNavigationUrl } = require("./functions")
const { constants } = require("../../utils/constants")

let notificationContent = {}
let { SUPERADMIN, MARKETINGMANAGER, ACCOUNTSADMIN } = constants

notificationContent.customerCreated = ({ name, userName, id, isSuperAdminApproved }) => {
    return {
        title: "Customer created",
        description: `<b>${name}</b> created by ${userName}`,
        createdDateTime: new Date(),
        navigationUrl: getNavigationUrl(notificationConstants.CUSTOMER_CREATED, id),
        isRead: 0,
        userRoles: isSuperAdminApproved ? [ACCOUNTSADMIN] : [SUPERADMIN, MARKETINGMANAGER, ACCOUNTSADMIN]
    }
}

notificationContent.customerCreatedWithZeroDeposit = ({ name, userName, id }) => {
    return {
        title: "Customer created",
        description: `<b>${name}</b> created by ${userName} with zero deposit amount`,
        createdDateTime: new Date(),
        navigationUrl: getNavigationUrl(notificationConstants.CUSTOMER_CREATED, id),
        isRead: 0,
        userRoles: [SUPERADMIN, MARKETINGMANAGER]
    }
}

notificationContent.customerCreatedWithLowPrice = ({ name, userName, id }) => {
    return {
        title: "Customer created",
        description: `<b>${name}</b> created by ${userName} with low product price`,
        createdDateTime: new Date(),
        navigationUrl: getNavigationUrl(notificationConstants.CUSTOMER_CREATED, id),
        isRead: 0,
        userRoles: [SUPERADMIN, MARKETINGMANAGER]
    }
}

notificationContent.customerDeliveryDetailsAdded = ({ name, userName, id }) => {
    return {
        title: "Delivery Details Added",
        description: `<b>${name}</b> Delivery Details added by ${userName}`,
        createdDateTime: new Date(),
        navigationUrl: getNavigationUrl(notificationConstants.DELIVERY_DETAILS_ADDED, id),
        isRead: 0,
        userRoles: [SUPERADMIN, MARKETINGMANAGER, ACCOUNTSADMIN]
    }
}

module.exports = { notificationContent }