const { notificationConstants } = require("./constants")
const { getNavigationUrl } = require("./functions")
const { constants } = require("../../utils/constants")

let notificationContent = {}
let { SUPERADMIN, MARKETINGMANAGER, ACCOUNTSADMIN } = constants

notificationContent.customerCreated = ({ customerName, userName, customerId }) => {
    return {
        title: "Customer created",
        description: `<b>${customerName}</b> created by ${userName}`,
        createdDateTime: new Date(),
        navigationUrl: getNavigationUrl(notificationConstants.CUSTOMER_CREATED, customerId),
        isRead: 0,
        userRoles: [SUPERADMIN, MARKETINGMANAGER, ACCOUNTSADMIN]
    }
}

module.exports = { notificationContent }