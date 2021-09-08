const { getSocketIo } = require("../../sockets")
const { notificationConstants } = require("./constants")

const getNavigationUrl = (type) => {
    switch (type) {
        case `${notificationConstants.CUSTOMER_CREATED}`: return
    }
}

const emitSocketToUsers = (data, userIds) => {
    if (userIds.length) {
        for (let i of userIds) {
            let messageId = notificationConstants.RECEIVE_NOTIFICATION + i.userId
            getSocketIo().emit(`${messageId}`, data)
        }
    }
}

module.exports = { getNavigationUrl, emitSocketToUsers }