const notificationQueries = require("../../dbQueries/notifications/queries")
const usersQueries = require("../../dbQueries/users/queries")
const { getSocketIo } = require("../../sockets")
const { notificationConstants } = require("./constants")
const { notificationContent } = require("./content")

const emitSocketToUsers = (data, userIds) => {
    if (userIds.length) {
        for (let i of userIds) {
            let messageId = notificationConstants.RECEIVE_NOTIFICATION + i.userId
            getSocketIo().emit(`${messageId}`, data)
        }
    }
}

const createNotifications = ({ id, name, userName, isSuperAdminApproved }, key) => {
    let notificationData = notificationContent[key]({ id, name, userName, isSuperAdminApproved })
    usersQueries.getUserIdsByRole(notificationData.userRoles, (err, usersData) => {
        if (err) console.log('Err', err)
        else {
            notificationQueries.createNotification(notificationData, (notificationErr, results) => {
                if (notificationErr) console.log('notificationErr', notificationErr)
                else {
                    const notificationId = results.insertId;
                    notificationQueries.createNotificationUsers({ userIds: usersData, notificationId }, (notifyUsersErr, data) => {
                        if (notifyUsersErr) console.log('notifyUsersErr', notifyUsersErr)
                        else {
                            emitSocketToUsers({ ...notificationData, notificationId }, usersData)
                        }
                    })
                }
            })
        }
    })
}

module.exports = { emitSocketToUsers, createNotifications }