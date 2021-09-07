const { notificationConstants } = require("./constants")

const getNavigationUrl = (type) => {
    switch (type) {
        case `${notificationConstants.CUSTOMER_CREATED}`: return
    }
}

module.exports = { getNavigationUrl }